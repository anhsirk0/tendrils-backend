import { Plant, Comment } from 'src/entities';

export type CommentItem = Omit<Comment, 'plant'> & {
  plant: Pick<Plant, 'plantname' | 'name' | 'avatarUrl'>;
};
