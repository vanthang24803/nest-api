import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';
import { MailModule } from './mail/mail.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RedisModule } from './redis/redis.module';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';
import { OptionModule } from './option/option.module';
import { PlanterModule } from './planter/planter.module';
import { UploadModule } from './upload/upload.module';
import { ColorModule } from './color/color.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    MailModule,
    CloudinaryModule,
    RedisModule,
    ProductModule,
    CategoriesModule,
    OptionModule,
    PlanterModule,
    UploadModule,
    ColorModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}
