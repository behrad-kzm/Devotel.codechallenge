import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hasValue } from '../../utils/validators/is-empty.validator';
import { EntityHelper } from '../../database/helpers/entity-helper';
import { USER_ROLE } from '../enums/user-roles.enum';


@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  firebaseSub!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ default: USER_ROLE.READER })
  role!: USER_ROLE;

  @BeforeInsert()
  @BeforeUpdate()
  async setEmail() {
    if (hasValue(this.email)) {
      this.email = this.email.toLocaleLowerCase()
    }
  }
}
