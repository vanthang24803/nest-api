import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

@Entity('users')
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 255, nullable: false })
  firstName: string;

  @Column({ length: 255, nullable: false })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  constructor(auth: Partial<Auth>) {
    super();
    Object.assign(this, auth);
  }
}
