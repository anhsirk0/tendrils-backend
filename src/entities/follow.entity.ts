import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from './';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Plant, (plant) => plant.following)
  to: Plant;

  @ManyToOne(() => Plant, (plant) => plant.followers)
  from: Plant;

  @Column({ name: 'created_at', default: () => new Date().valueOf() })
  createdAt: number;
}
