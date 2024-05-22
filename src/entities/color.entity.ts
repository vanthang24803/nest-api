import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Planter } from './planter.entity';
import { Exclude } from 'class-transformer';

@Entity('colors')
export class Color extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, type: 'varchar', unique: true })
  name: string;

  @Column({ length: 255, type: 'varchar', unique: true })
  value: string;

  @Exclude()
  @ManyToOne(() => Planter, (plater) => plater.colors)
  plater: Planter;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  constructor(color: Partial<Color>) {
    super();
    Object.assign(this, color);
  }
}
