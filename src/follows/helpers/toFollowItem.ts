import { Follow, Plant } from 'src/entities';
import { FollowItem } from '../types';
import { pick } from 'src/helpers';

interface Params {
  follow: Follow;
  meFollowing: Array<Follow>;
  plantname: Plant['plantname'];
  key: 'from' | 'to';
}

function toFollowItem({
  follow,
  plantname,
  meFollowing,
  key,
}: Params): FollowItem {
  return {
    ...pick(follow[key], 'id', 'name', 'plantname', 'avatarUrl'),
    createdAt: follow.createdAt,
    isFollowed: meFollowing.some((pf) => pf.to.id === follow[key].id),
    isMe: follow[key].plantname === plantname,
  };
}

export default toFollowItem;
