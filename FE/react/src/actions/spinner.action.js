import {Spinner} from '../actions/typs'


export const showSpinner = ()=> {
    return (dispatch, getState)=> {
        dispatch(Spinner.SHOW_SPINNER)
    }
};

export const hideSpinner = ()=> {
    return (dispatch, getState)=> {
        dispatch(Spinner.HIDE_SPINNER)
    }
};