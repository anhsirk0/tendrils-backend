import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tendril } from './tendril.entity';

@Entity()
export class Curl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 17 })
  plantname: string;

  @ManyToOne(() => Tendril, (tendril) => tendril.curls)
  tendril: Tendril;

  @Column({ name: 'created_at', default: () => new Date().valueOf() })
  createdAt: number;
}
