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
import { Option } from './option.entity';
import { Color } from './color.entity';

@Entity('planters')
export class Planter extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  sale: number;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column({ default: 0, type: 'float' })
  price: number;

  @ManyToOne(() => Option, (option) => option.planters)
  option: Option;

  @OneToMany(() => Color, (color) => color.plater)
  colors: Color[];

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  constructor(planter: Partial<Planter>) {
    super();
    Object.assign(this, planter);
  }
}
