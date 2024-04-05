import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tendril } from './tendril.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 17 })
  plantname: string;

  @Column()
  content: string;

  @ManyToOne(() => Tendril, (tendril) => tendril.curls)
  tendril: Tendril;

  @Column({ name: 'created_at', default: () => new Date().valueOf() })
  createdAt: number;
}
