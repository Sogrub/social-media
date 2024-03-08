import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { BycriptService } from 'src/shared/services/bycript/bycript.service';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { MailsenderService } from 'src/shared/services/mailsender/mailsender.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, BycriptService, JwtService, MailsenderService],
})
export class AuthModule {}
