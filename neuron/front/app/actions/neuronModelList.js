export const MODEL_FETCH = '@@model/FETCH';
export const MODEL_FETCH_FAIL = '@@model/FETCH_FAIL';
export const MODEL_FETCH_SUCCESS = '@@model/FETCH_SUCCESS';

export const MODEL_ADD = '@@model/ADD';
export const MODEL_ADD_FAIL = '@@model/ADD_FAIL';
export const MODEL_ADD_SUCCESS = '@@model/ADD_SUCCESS';

export const MODEL_DELETE = '@@model/DELETE';
export const MODEL_DELETE_FAIL = '@@model/DELETE_FAIL';
export const MODEL_DELETE_SUCCESS = '@@model/DELETE_SUCCESS';


export const modelFetch = () => ({
  type: MODEL_FETCH,
  context: {},
  payload:{
    request:{
      method: 'POST',
      url:`/modelFetch`,
    }
  }
})

export const modelAdd = (
  modelInfo,
  ) => ({
  type: MODEL_ADD,
  context: {
    modelInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/modelAdd`,
      data: {
        'config': modelInfo,
      },
    }
  }
})

export const modelDelete = (
  modelInfo,
  ) => ({
  type: MODEL_DELETE,
  context: {
    modelInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/modelDelete`,
      data: {
        'config': modelInfo,
      },
    }
  }
})

