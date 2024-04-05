import { Tendril, Curl } from 'src/entities';

export interface FeedTendril
  extends Pick<
    Tendril,
    'id' | 'title' | 'content' | 'uuid' | 'createdAt' | 'updatedAt'
  > {
  commentsCount: number;
  curls: Array<Pick<Curl, 'plantname'>>;
}
