import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { Tendril, Curl, Follow, Comment } from './';

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 17 })
  plantname: string;

  @Column()
  bio: string;

  @Column()
  avatarUrl: string;

  @Column()
  password: string;

  @Column()
  uuid: string;

  @OneToMany(() => Tendril, (tendril) => tendril.plant, { cascade: true })
  tendrils: Array<Tendril>;

  @OneToMany(() => Curl, (curl) => curl.plantname, { cascade: true })
  curls: Array<Curl>;

  @OneToMany(() => Comment, (comment) => comment.plant, { cascade: true })
  comments: Array<Comment>;

  @OneToMany(() => Follow, (follow) => follow.from, { cascade: true })
  following: Array<Follow>;

  @OneToMany(() => Follow, (follow) => follow.to, {
    cascade: true,
    eager: true,
  })
  followers: Array<Follow>;

  @Column({ name: 'created_at', default: () => new Date().valueOf() })
  createdAt: number;

  @Column({ name: 'updated_at', default: () => new Date().valueOf() })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @BeforeInsert()
  createUuid() {
    this.uuid = nanoid();
  }
}
