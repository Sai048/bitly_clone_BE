import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Res,
  Redirect,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LinksService } from './links-data.service';
import { LinkDataDto, UpdateLinkDto } from './dtos/link-data.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../../data/auth-data/src/lib/auth.guard';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private service: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  create(@Body() linkDataDto: LinkDataDto) {
    return this.service.create(linkDataDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('user/:userId')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'fromDate', type: String, required: false })
  @ApiQuery({ name: 'toDate', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getByUserId(
    @Param('userId') userId: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('search') search?: string
  ) {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const filters: any = {};

    if (fromDate || toDate) {
      if (fromDate) filters.fromDate = new Date(fromDate);
      if (toDate) filters.toDate = new Date(toDate);
    }
    if (search) {
      filters.search = search;
    }

    return this.service.getByUser(userId, pageNumber, limitNumber, filters);
  }

  @Get(':code')
  @Redirect()
  async findOne(@Param('code') code: string, @Res() res: Response) {
    const link = await this.service.findOne(code);
    return { url: link.longUrl, statusCode: 301 };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('id/:id')
  async findOneById(@Param('id') id: number) {
    return await this.service.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Put(':id')
  async updateLink(
    @Param('id') id: number,
    @Body() updateLinkDto: UpdateLinkDto
  ) {
    return this.service.update(id, updateLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':code')
  delete(@Param('code') code: number) {
    return this.service.delete(code);
  }
}
