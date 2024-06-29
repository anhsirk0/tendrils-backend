import { Plant, Follow } from 'src/entities';

export interface FollowItem
  extends Pick<Plant, 'id' | 'name' | 'plantname' | 'avatarUrl'> {
  createdAt: Follow['createdAt'];
  isFollowed: boolean;
  isMe: boolean;
}
