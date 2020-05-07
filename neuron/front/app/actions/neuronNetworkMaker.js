export const NETWORK_FETCH = '@@network/FETCH';
export const NETWORK_FETCH_FAIL = '@@network/FETCH_FAIL';
export const NETWORK_FETCH_SUCCESS = '@@network/FETCH_SUCCESS';

export const networkFetch = () => ({
  type: NETWORK_FETCH,
  context: {},
  payload:{
    request:{
      method: 'POST',
      url:`/networkFetch`,
    }
  }
})
