import { SET_YAWPS, LOADING_DATA, LIKE_YAWP, UNLIKE_YAWP, LOADING_UI } from '../types';
import axios from 'axios';


//Get all Yawps
export const getYawps = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios.get('./yawps')
    .then(res => {
      dispatch({
        type: SET_YAWPS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: SET_YAWPS,
        payload: []
      })
    })
}


//Like a Yawp
export const likeYawp = (yawpId) => dispatch => {
  axios.get(`./yawp/${yawpId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_YAWP,
        payload: res.data
      })
    })
    .catch(err => {
      console.log(err)
    })
}


//Unlike a Yawp
export const unlikeYawp = (yawpId) => dispatch => {
  axios.get(`./yawp/${yawpId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_YAWP,
        payload: res.data
      })
    })
    .catch(err => {
      console.log(err)
    })
}
