import { SET_YAWPS, LIKE_YAWP, UNLIKE_YAWP, LOADING_DATA } from '../types';

const initialState = {
  yawps: [],
  yawp: {},
  loading: false
}

export default function(state =initialState, action) {
  switch(action.type){
    case LOADING_DATA:
      return {
        ...state,
        loading:true
      }
    case SET_YAWPS:
      return {
        ...state,
        yawps: action.payload,
        loading: false
      }
    case LIKE_YAWP:
    case UNLIKE_YAWP:
      let index = state.yawps.findIndex((yawp) => yawp.yawpId === action.payload.yawpId);
      state.yawps[index] = action.payload;
      return {
        ...state,
      }
    default:
      return {
        ...state
      }
  }
}