import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../../../../models/links-model/src/lib/links-model.entity';
import { LinksController } from './links-data.controller';
import { LinksService } from './links-data.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService],
  exports: [],
  imports: [TypeOrmModule.forFeature([Link])],
})
export class LinksDataModule {}
