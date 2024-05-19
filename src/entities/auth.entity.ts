import { Exclude } from 'class-transformer';
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
import { Role } from './role.entity';

@Entity('users')
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ length: 255, nullable: false, name: 'first_name' })
  firstName: string;

  @Column({ length: 255, nullable: false, name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({ default: false, name: 'verify_email' })
  verifyEmail: boolean;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  @Exclude()
  @ManyToMany(() => Role, { eager: true, cascade: true })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  constructor(auth: Partial<Auth>) {
    super();
    Object.assign(this, auth);
  }
}
