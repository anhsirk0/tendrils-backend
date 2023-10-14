import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { Tendril, Curl } from './';

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 17 })
  plantname: string;

  @Column()
  password: string;

  @Column()
  uuid: string;

  @OneToMany(() => Tendril, (tendril) => tendril.plant, { cascade: true })
  tendrils: Array<Tendril>;

  @OneToMany(() => Curl, (curl) => curl.plant, { cascade: true })
  curls: Array<Curl>;

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
