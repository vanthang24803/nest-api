import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity('images')
export class Image extends BaseEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Exclude()
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  constructor(image: Partial<Image>) {
    super();
    Object.assign(this, image);
  }
}
