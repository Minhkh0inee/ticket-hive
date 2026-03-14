import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

@Entity()
export class User extends AbstractEntity {
  @Column({
    length: 100
  })
  firstName: string;

  @Column({
    length: 100
  })
  lastName: string;

  @Column({unique:true, length: 100})
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole
}
