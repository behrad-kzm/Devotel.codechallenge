import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from '../../database/helpers/entity-helper';

@Index('authorId_index', ['authorId'])
@Entity()
export class BlogPost extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  imageUrl!: string;

  @Column()
  authorId!: string;
}
