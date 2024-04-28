import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tendril, Plant } from 'src/entities';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Plant, (plant) => plant.comments)
  plant: Plant;

  @Column()
  content: string;

  @ManyToOne(() => Tendril, (tendril) => tendril.comments)
  tendril: Tendril;

  @Column({ name: 'created_at', default: () => new Date().valueOf() })
  createdAt: number;
}
