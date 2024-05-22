import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Planter, Product } from '@/entities';
import { Exclude } from 'class-transformer';

@Entity('options')
export class Option extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Planter, (plater) => plater.option)
  planters: Planter[];

  @Exclude()
  @ManyToOne(() => Product, (product) => product.options)
  product: Product;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  constructor(option: Partial<Option>) {
    super();
    Object.assign(this, option);
  }
}
