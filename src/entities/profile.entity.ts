import { Rank } from '@/enums';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'total_orders', default: 0 })
  totalOrders: number;

  @Column({ name: 'purchase_amount', default: 0 })
  purchaseAmount: number;

  @Column({ name: 'rank', type: 'enum', enum: Rank, default: Rank.Bronze })
  rank: Rank;

  @Exclude()
  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;
}
