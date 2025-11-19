import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksDataModule } from '../../../../libs/data/links-data/src/lib/links-data.module';
import { AuthDataModule } from '../../../../libs/data/auth-data/src/lib/auth-data.module';

@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, 
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthDataModule,
    LinksDataModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
