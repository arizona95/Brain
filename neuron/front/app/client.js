import axios from 'axios';
import { getActionTypes } from './actions';

export const client = axios.create({
  baseURL: 'http://localhost:5000/',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const returnRejectedPromiseOnError = false;

export const defaultClientName = 'default';

export const isAxiosRequest = action => action.payload && action.payload.request;

export const getRequestConfig = action => action.payload.request;

export const getClientName = action => action.payload.client;

export const getRequestOptions = action => action.payload.options;

export const onSuccess = ({ action, next, response }, options) => {
  const nextAction = {
    type: getActionTypes(action, options)[1],
    context: action.context || {},
    payload: response,
    meta: {
      previousAction: action,
    },
  };
  next(nextAction);
  return nextAction;
};

export const onError = ({ action, next, error }, options) => {
  let errorObject;
  if (!error.response) {
    errorObject = {
      data: error.message,
      status: 0,
    };
  } else {
    errorObject = error;
  }
  const nextAction = {
    type: getActionTypes(action, options)[2],
    context: action.context || {},
    error: errorObject,
    meta: {
      previousAction: action,
    },
  };

  next(nextAction);
  return nextAction;
};

export const onComplete = () => {
};
