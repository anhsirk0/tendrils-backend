import { Tendril, Plant } from 'src/entities';

export interface FeedTendril
  extends Pick<
    Tendril,
    'id' | 'title' | 'content' | 'uuid' | 'createdAt' | 'updatedAt'
  > {
  commentsCount: number;
  curls: Array<Plant['plantname']>;
  author: Pick<Plant, 'name' | 'plantname' | 'avatarUrl'>;
}
