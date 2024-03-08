import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BycriptService } from './shared/services/bycript/bycript.service';
import { JwtService } from './shared/services/jwt/jwt.service';
import { MailsenderService } from './shared/services/mailsender/mailsender.service';
import { AuthMiddleware } from './shared/middlewares/auth/auth.middleware';
import { UserController } from './modules/user/user.controller';
import { PostModule } from './modules/post/post.module';
import { PostController } from './modules/post/post.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      authSource: "admin",
      auth: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS
      },
      dbName: process.env.DATABASE_NAME
    }),
    UserModule,
    AuthModule,
    PostModule,
  ],
  controllers: [],
  providers: [BycriptService, JwtService, MailsenderService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UserController, PostController);
  }
}
