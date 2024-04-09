import { Tendril, Curl, Plant } from 'src/entities';

export interface FeedTendril
  extends Pick<
    Tendril,
    'id' | 'title' | 'content' | 'uuid' | 'createdAt' | 'updatedAt'
  > {
  commentsCount: number;
  curls: Array<Pick<Curl, 'plantname'>>;
  author: Pick<Plant, 'name' | 'plantname'>;
}
