export const MODEL_IMPORT = '@@model/IMPORT';
export const MODEL_IMPORT_FAIL = '@@model/IMPORT_FAIL';
export const MODEL_IMPORT_SUCCESS = '@@model/IMPORT_SUCCESS';


export const MODEL_EXPORT = '@@model/EXPORT';
export const MODEL_EXPORT_FAIL = '@@model/EXPORT_FAIL';
export const MODEL_EXPORT_SUCCESS = '@@model/EXPORT_SUCCESS';

export const MODEL_SAVEAS = '@@model/SAVEAS';
export const MODEL_SAVEAS_FAIL = '@@model/SAVEAS_FAIL';
export const MODEL_SAVEAS_SUCCESS = '@@model/SAVEAS_SUCCESS';


export const modelImport = (
  modelInfo,
  ) => ({
  type: MODEL_IMPORT,
  context: {
    modelInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/modelImport`,
      data: {
        'config': modelInfo,
      },
    }
  }
})

export const modelExport = (
  modelInfo,
  ) => ({
  type: MODEL_EXPORT,
  context: {
    modelInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/modelExport`,
      data: {
        'config': modelInfo,
      },
    }
  }
})

export const modelSaveAs = (
  modelInfo,
  ) => ({
  type: MODEL_SAVEAS,
  context: {
    modelInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/modelSaveAs`,
      data: {
        'config': modelInfo,
      },
    }
  }
})
