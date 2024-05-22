import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category, Image, Option } from '@/entities';
import { Exclude } from 'class-transformer';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, name: 'product_name', type: 'varchar' })
  name: string;

  @Column({ type: 'text', name: 'product_thumbnail' })
  thumbnail: string;

  @Exclude()
  @Column({ type: 'text', name: 'product_description', nullable: true })
  description: string;

  @Exclude()
  @Column({ type: 'text', name: 'product_guide', nullable: true })
  guide: string;

  @Exclude()
  @OneToMany(() => Image, (image) => image.product, {
    eager: true,
    cascade: true,
  })
  images: Image[];

  @OneToMany(() => Option, (option) => option.product, {
    eager: true,
    cascade: true,
  })
  options: Option[];

  @ManyToMany(() => Category, { eager: true, cascade: true })
  @JoinTable({
    name: 'products_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  constructor(product: Partial<Product>) {
    super();
    Object.assign(this, product);
  }
}
