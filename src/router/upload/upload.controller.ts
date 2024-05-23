import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidationUUID } from '@/utils';
import { AtGuard } from '../auth/common/guards';
import { RoleEnum as Role } from '@/enums';
import { Roles } from '../auth/common/decorators';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':id')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  remove(
    @Param('id', new ValidationUUID()) id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.uploadService.remove(id, imageId);
  }
}
