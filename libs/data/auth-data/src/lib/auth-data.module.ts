import { Module } from '@nestjs/common';
import { UsersController } from './auth.controller';
import { UsersService } from './auth.service';
import { User } from 'libs/models/auth-model/src/lib/auth-model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModelModule } from 'libs/models/auth-model/src/lib/auth-model.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService,JwtStrategy],
  exports: [],
   imports: [
    AuthModelModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
       JwtModule.register({
      secret: process.env['Secret-Key'],
      signOptions: { expiresIn: '1d' },
    })
  ],
})
export class AuthDataModule {}
