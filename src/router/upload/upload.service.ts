import { CloudinaryService } from '@/configs/cloudinary/cloudinary.service';
import { Image } from '@/entities';
import { ImageRepository, ProductRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly imageRepository: ImageRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(
    id: string,
    files: Array<Express.Multer.File>,
  ): Promise<Image[]> {
    const product = await this.productRepository.findById(id);

    const images = [];

    for (const file of files) {
      const response = await this.cloudinary.uploadFile(file);

      const newImage = new Image({
        id: response.public_id,
        url: response.url,
      });

      images.push(newImage);
      product.images.push(newImage);
    }

    await this.productRepository.save(product);

    return images;
  }

  async findAll(id: string): Promise<Image[]> {
    const product = await this.productRepository.findById(id);

    return product.images;
  }

  async remove(id: string, imageId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findById(id);

    const image = await this.imageRepository.findOneBy({ id: imageId });

    if (!image) throw new NotFoundException('Image not found');

    await this.cloudinary.delete(imageId);

    product.images = product.images.filter((img) => img.id !== imageId);

    await this.productRepository.save(product);

    return {
      message: 'Image deleted successfully!',
    };
  }
}
