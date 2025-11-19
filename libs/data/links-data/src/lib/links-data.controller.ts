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

  @Get(':code')
  @Redirect()
  async findOne(@Param('code') code: string, @Res() res: Response) {
    const link = await this.service.findOne(code);
    return { url: link.longUrl, statusCode: 301 };
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
  delete(@Param('code') code: string) {
    return this.service.delete(code);
  }
}
