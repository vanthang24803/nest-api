import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Auth } from './auth.entity';
import { RoleEnum } from '@/enums/role.enum';
import { Exclude } from 'class-transformer';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  name: string;

  @ManyToMany(() => Auth, (auth) => auth.roles)
  userRoles: Auth[];

  @Exclude()
  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;
}
