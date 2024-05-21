import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, name: 'category_name', type: 'varchar', unique: true })
  name: string;

  @Exclude()
  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }
}
