import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, name: 'product_name', type: 'varchar' })
  name: string;

  @Column({ type: 'text', name: 'product_thumbnail' })
  thumbnail: string;

  @Column({ type: 'text', name: 'product_description', nullable: true })
  description: string;

  @Column({ type: 'text', name: 'product_guide', nullable: true })
  guide: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

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
