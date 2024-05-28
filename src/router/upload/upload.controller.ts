import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Body,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AtGuard } from '@/common/guards';
import { RoleEnum as Role } from '@/enums';
import { GetProductId, Roles } from '@/common/decorators';
import { ImageDto } from './dto/list-image.dto';

@Controller('api/products/')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':productId/uploads')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetProductId() id: string,
  ) {
    return this.uploadService.create(id, files);
  }

  @Get(':productId/uploads')
  findAll(@GetProductId() id: string) {
    return this.uploadService.findAll(id);
  }

  @Delete(':productId/uploads/delete')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  remove(@GetProductId() id: string, @Body() images: ImageDto[]) {
    return this.uploadService.remove(id, images);
  }
}
