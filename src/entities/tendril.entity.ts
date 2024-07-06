import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { Plant, Curl, Comment } from './';

@Entity()
export class Tendril {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Plant, (plant) => plant.tendrils)
  plant: Plant;

  @OneToMany(() => Curl, (curl) => curl.tendril, { cascade: true, eager: true })
  curls: Array<Curl>;

  @OneToMany(() => Comment, (comment) => comment.tendril, { cascade: true })
  comments: Array<Comment>;

  @Column({ length: 80 })
  title: string;

  @Column()
  content: string;

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
