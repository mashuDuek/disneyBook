import * as APIUtil from '../util/image_util';
import { receiveUser } from './user_actions';

export const RECEIVE_COVER_PIC = 'RECEIVE_COVER_PIC';

// export const receiveCoverPic = (pic) => {
//   debugger
//   return {
//     type: RECEIVE_COVER_PIC,
//     pic
//   };
// };

export const updateCoverPic = (pic) => {
  return (dispatch) => {
    return APIUtil.updateCover(pic).
      then((user) => dispatch(receiveUser(user))
    );
  };
};
