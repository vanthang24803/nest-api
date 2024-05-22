import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidationUUID } from '@/utils';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':id')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', new ValidationUUID()) id: string,
  ) {
    return this.uploadService.create(id, files);
  }

  @Get(':id')
  findAll(@Param('id', new ValidationUUID()) id: string) {
    return this.uploadService.findAll(id);
  }

  @Delete(':id/image/:imageId')
  remove(
    @Param('id', new ValidationUUID()) id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.uploadService.remove(id, imageId);
  }
}
