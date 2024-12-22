import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from '../../database/helpers/entity-helper';

@Entity()
export class ImageDetails extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  url!: string;
}
