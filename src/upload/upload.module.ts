import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image as PhotoEntity } from '@/entities';
import { ImageRepository } from '@/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  controllers: [UploadController],
  providers: [UploadService, ImageRepository],
})
export class UploadModule {}
