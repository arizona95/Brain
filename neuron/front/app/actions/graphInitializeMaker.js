export const GRAPH_EXPORT = '@@graph/EXPORT';
export const GRAPH_EXPORT_FAIL = '@@graph/EXPORT_FAIL';
export const GRAPH_EXPORT_SUCCESS = '@@graph/EXPORT_SUCCESS';

export const GRAPH_SAVEAS = '@@graph/SAVEAS';
export const GRAPH_SAVEAS_FAIL = '@@graph/SAVEAS_FAIL';
export const GRAPH_SAVEAS_SUCCESS = '@@graph/SAVEAS_SUCCESS';


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
