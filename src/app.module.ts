import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/router/auth/auth.module';
import { DatabaseModule } from '@/configs/database/database.module';
import { MailModule } from '@/configs/mail/mail.module';
import { CloudinaryService } from '@/configs/cloudinary/cloudinary.service';
import { CloudinaryModule } from '@/configs/cloudinary/cloudinary.module';
import { RedisModule } from '@/configs/redis/redis.module';
import { ProductModule } from '@/router/product/product.module';
import { CategoriesModule } from '@/router/categories/categories.module';
import { OptionModule } from '@/router/option/option.module';
import { PlanterModule } from '@/router/planter/planter.module';
import { UploadModule } from '@/router/upload/upload.module';
import { ColorModule } from '@/router/color/color.module';

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
