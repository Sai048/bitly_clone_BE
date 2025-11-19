import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../../../../models/links-model/src/lib/links-model.entity';
import { LinkDataDto } from './dtos/link-data.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private repo: Repository<Link>
  ) {}

  async create(linkDataDto: LinkDataDto) {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;

    let shortCode = '';
    let exists = true;

    while (exists) {
      shortCode = Array.from(
        { length: codeLength },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('');

      exists = !!(await this.repo.findOne({ where: { shortUrl: shortCode } }));
    }

    const newLink = this.repo.create({
      ...linkDataDto,
      shortUrl: shortCode,
    });

    const data = await this.repo.save(newLink);
    return {
      HttpStatus: HttpStatus.OK,
      message: 'Data created successfully',
      data,
    };
  }

  async findAll() {
    const res =await this.repo.find();
    return {
      HttpStatus: HttpStatus.OK,
      message: 'Data retrived successfully',
      data: res,
    };
  }

   async getByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
    filters?: {
      fromDate?: string;
      toDate?: string;
      search?: string
    }
  ): Promise<any> {
    const user = await this.repo.findOne({ where: { userId: userId } });
    if (!user) throw new NotFoundException('User not found');

   
    const query = this.repo.createQueryBuilder('t').where('t.userId = :userId', { userId });
    if (filters?.fromDate) {
      query.andWhere('t.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters?.toDate) {
      query.andWhere('t.createdAt <= :toDate', { toDate: filters.toDate });
    }

     if (filters?.search && filters.search.trim() !== "") {
    query.andWhere(
      `(t.title LIKE :search OR t.shortCode LIKE :search OR t.longUrl LIKE :search)`,
      { search: `%${filters.search}%` }
    );
  }

    query.orderBy('t.createdAt', 'DESC');
    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();


    return {
      status: HttpStatus.OK,
      data: data,
      total,
      page,
      limit,
    };
  }

  async findOne(code: string) {
    const link = await this.repo.findOne({ where: { shortUrl: code } });
    if (!link) throw new NotFoundException('Code not found');
    this.incrementClicks(code);
    return link;
  }

  async update(id: number, updateLinkDto: any) {
    const link = await this.repo.findOne({ where: { id } });
    if (!link) throw new NotFoundException('Link not found');

    const checkShortUrl = await this.repo.findOne({
      where: { shortUrl: updateLinkDto.shortUrl },
    });
    if (checkShortUrl && checkShortUrl.id !== id) {
      throw new ConflictException('Short URL already exists');
    }

    Object.assign(link, updateLinkDto);

    const updatedLink = await this.repo.save(link);
    return {
      HttpStatus: HttpStatus.OK,
      message: 'Data updated successfully',
      data: updatedLink,
    };
  }

  async delete(code: number) {
    const res = await this.repo.delete({ id: code });
    if (!res.affected) throw new NotFoundException('Code not found');
    return {
      HttpStatus: HttpStatus.OK,
      message: 'Data deleted successfully',
    };
  }

  async incrementClicks(code: string) {
    const link = await this.findOne(code);
    link.clicks += 1;
    link.lastClicked = new Date();
    await this.repo.save(link);
  }
}
