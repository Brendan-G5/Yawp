import { SET_YAWPS, LIKE_YAWP, UNLIKE_YAWP, LOADING_DATA, DELETE_YAWP, POST_YAWP, SET_YAWP } from '../types';

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
    case SET_YAWP:
      return {
        ...state,
        yawp: action.payload
      }
    case LIKE_YAWP:
    case UNLIKE_YAWP:
      let likeIndex = state.yawps.findIndex((yawp) => yawp.yawpId === action.payload.yawpId);
      state.yawps[likeIndex] = action.payload;
      return {
        ...state,
      }
    case DELETE_YAWP:
      let delIndex = state.yawps.findIndex((yawp) => yawp.yawpId === action.payload);
      state.yawps.splice(delIndex, 1);
      return {
        ...state
      }
    case POST_YAWP:
      return {
        ...state,
        yawps: [
          action.payload,
          ...state.yawps
        ]
      }
    default:
      return {
        ...state
      }
  }
}