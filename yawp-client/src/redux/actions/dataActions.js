import { SET_YAWPS, LOADING_DATA, LIKE_YAWP, UNLIKE_YAWP, DELETE_YAWP, SET_ERRORS, CLEAR_ERRORS, POST_YAWP, LOADING_UI, SET_YAWP, STOP_LOADING_UI } from '../types';
import axios from 'axios';


//Get all Yawps
export const getYawps = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios.get('/yawps')
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

//Get one yawp
export const getYawp = (yawpId) => dispatch => {
  dispatch({
    type: LOADING_UI
  });
  axios.get(`/yawp/${yawpId}`)
    .then(res => {
      dispatch({
        type: SET_YAWP,
        payload: res.data
      })
      dispatch({
        type: STOP_LOADING_UI
      })
    })
    .catch(err => console.log(err));
}

//Post Yawp

export const postYawp = (newYawp) => (dispatch) => {
  dispatch({type: LOADING_UI})
  console.log(newYawp);
  axios.post('/yawp', newYawp)
    .then(res => {
      dispatch({
        type: POST_YAWP,
        payload: res.data
      });
      dispatch({
        type: CLEAR_ERRORS
      })
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    })
}


//Like a Yawp
export const likeYawp = (yawpId) => dispatch => {
  axios.get(`/yawp/${yawpId}/like`)
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
  axios.get(`/yawp/${yawpId}/unlike`)
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

//Delete a Yawp

export const deleteYawp = (yawpId) => dispatch => {
  axios.delete(`/yawp/${yawpId}`)
    .then(res => {
      dispatch({
        type: DELETE_YAWP,
        payload: yawpId
      })
    })
    .catch(err => console.log(err))
}

export const clearErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  })
}


