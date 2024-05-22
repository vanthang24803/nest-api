import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image as PhotoEntity, Product } from '@/entities';
import { ImageRepository, ProductRepository } from '@/repositories';
import { CloudinaryService } from '@/configs/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity, Product])],
  controllers: [UploadController],
  providers: [
    UploadService,
    ImageRepository,
    CloudinaryService,
    ProductRepository,
  ],
})
export class UploadModule {}
