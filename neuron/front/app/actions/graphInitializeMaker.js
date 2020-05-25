export const GRAPH_FETCH = '@@graph/FETCH';
export const GRAPH_FETCH_FAIL = '@@graph/FETCH_FAIL';
export const GRAPH_FETCH_SUCCESS = '@@graph/FETCH_SUCCESS';

export const GRAPH_ADD = '@@graph/ADD';
export const GRAPH_ADD_FAIL = '@@graph/ADD_FAIL';
export const GRAPH_ADD_SUCCESS = '@@graph/ADD_SUCCESS';

export const GRAPH_DELETE = '@@graph/DELETE';
export const GRAPH_DELETE_FAIL = '@@graph/DELETE_FAIL';
export const GRAPH_DELETE_SUCCESS = '@@graph/DELETE_SUCCESS';

export const GRAPH_EXPORT = '@@graph/EXPORT';
export const GRAPH_EXPORT_FAIL = '@@graph/EXPORT_FAIL';
export const GRAPH_EXPORT_SUCCESS = '@@graph/EXPORT_SUCCESS';

export const GRAPH_SAVEAS = '@@graph/SAVEAS';
export const GRAPH_SAVEAS_FAIL = '@@graph/SAVEAS_FAIL';
export const GRAPH_SAVEAS_SUCCESS = '@@graph/SAVEAS_SUCCESS';

export const graphFetch = () => ({
  type: GRAPH_FETCH,
  context: {},
  payload:{
    request:{
      method: 'POST',
      url:`/graphFetch`,
    }
  }
})

export const graphAdd = (
  graphInfo,
  ) => ({
  type: GRAPH_ADD,
  context: {
    graphInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/graphAdd`,
      data: {
        'config': graphInfo,
      },
    }
  }
})

export const graphDelete = (
  graphInfo,
  ) => ({
  type: GRAPH_DELETE,
  context: {
    graphInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/graphDelete`,
      data: {
        'config': graphInfo,
      },
    }
  }
})

export const graphExport = (
  graphInfo,
  ) => ({
  type: GRAPH_EXPORT,
  context: {
    graphInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/graphExport`,
      data: {
        'config': graphInfo,
      },
    }
  }
})

export const graphSaveAs = (
  graphInfo,
  ) => ({
  type: GRAPH_SAVEAS,
  context: {
    graphInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/graphSaveAs`,
      data: {
        'config': graphInfo,
      },
    }
  }
})
