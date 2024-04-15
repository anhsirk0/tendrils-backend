import { Tendril } from 'src/entities';
import { FeedTendril } from '../types';

function toFeedTendril(tendril: Tendril): FeedTendril {
  let ft = {
    ...tendril,
    curls: tendril.curls.map((c) => c.plantname),
    commentsCount: tendril.comments.length,
    author: {
      name: tendril.plant.name,
      plantname: tendril.plant.plantname,
    },
  };
  delete ft.comments;
  delete ft.plant;
  return ft;
}

export default toFeedTendril;
