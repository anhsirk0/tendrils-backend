import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Plant, Tendril } from './';
import { nanoid } from 'nanoid';

@Entity()
export class Curl {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Plant, (plant) => plant.curls)
  plant: Plant;

  @ManyToOne(() => Tendril, (tendril) => tendril.curls)
  tendril: Tendril;

  @Column()
  uuid: string;

  @Column({ name: 'created_at', default: () => new Date().valueOf() })
  createdAt: number;

  @Column({ name: 'updated_at', default: () => new Date().valueOf() })
  updatedAt: number;

  @BeforeInsert()
  createUuid() {
    this.uuid = nanoid();
  }
}
