import * as APIUtil from '../util/image_util';

export const RECEIVE_COVER_PIC = 'RECEIVE_COVER_PIC';

export const receiveCoverPic = (pic) => {
  debugger
  return {
    type: RECEIVE_COVER_PIC,
    pic
  };
};

export const updateCoverPic = (pic) => {
  debugger
  return (dispatch) => {
    return APIUtil.updateCover(pic).
      then((pic) => dispatch(receiveCoverPic(pic))
    );
  };
};
