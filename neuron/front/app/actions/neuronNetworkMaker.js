export const NETWORK_FETCH = '@@network/FETCH';
export const NETWORK_FETCH_FAIL = '@@network/FETCH_FAIL';
export const NETWORK_FETCH_SUCCESS = '@@network/FETCH_SUCCESS';

export const NETWORK_ADD = '@@network/ADD';
export const NETWORK_ADD_FAIL = '@@network/ADD_FAIL';
export const NETWORK_ADD_SUCCESS = '@@network/ADD_SUCCESS';

export const NETWORK_DELETE = '@@network/DELETE';
export const NETWORK_DELETE_FAIL = '@@network/DELETE_FAIL';
export const NETWORK_DELETE_SUCCESS = '@@network/DELETE_SUCCESS';

export const NETWORK_IMPORT = '@@network/IMPORT';
export const NETWORK_IMPORT_FAIL = '@@network/IMPORT_FAIL';
export const NETWORK_IMPORT_SUCCESS = '@@network/IMPORT_SUCCESS';


export const NETWORK_EXPORT = '@@network/EXPORT';
export const NETWORK_EXPORT_FAIL = '@@network/EXPORT_FAIL';
export const NETWORK_EXPORT_SUCCESS = '@@network/EXPORT_SUCCESS';

export const NETWORK_SAVEAS = '@@network/SAVEAS';
export const NETWORK_SAVEAS_FAIL = '@@network/SAVEAS_FAIL';
export const NETWORK_SAVEAS_SUCCESS = '@@network/SAVEAS_SUCCESS';

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

export const networkAdd = (
  networkInfo,
  ) => ({
  type: NETWORK_ADD,
  context: {
    networkInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/networkAdd`,
      data: {
        'config': networkInfo,
      },
    }
  }
})

export const networkDelete = (
  networkInfo,
  ) => ({
  type: NETWORK_DELETE,
  context: {
    networkInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/networkDelete`,
      data: {
        'config': networkInfo,
      },
    }
  }
})


export const networkImport = (
  networkInfo,
  ) => ({
  type: NETWORK_IMPORT,
  context: {
    networkInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/networkImport`,
      data: {
        'config': networkInfo,
      },
    }
  }
})

export const networkExport = (
  networkInfo,
  ) => ({
  type: NETWORK_EXPORT,
  context: {
    networkInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/networkExport`,
      data: {
        'config': networkInfo,
      },
    }
  }
})

export const networkSaveAs = (
  networkInfo,
  ) => ({
  type: NETWORK_SAVEAS,
  context: {
    networkInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/networkSaveAs`,
      data: {
        'config': networkInfo,
      },
    }
  }
})