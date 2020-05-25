export const GROUP_FETCH = '@@group/FETCH';
export const GROUP_FETCH_FAIL = '@@group/FETCH_FAIL';
export const GROUP_FETCH_SUCCESS = '@@group/FETCH_SUCCESS';

export const GROUP_ADD = '@@group/ADD';
export const GROUP_ADD_FAIL = '@@group/ADD_FAIL';
export const GROUP_ADD_SUCCESS = '@@group/ADD_SUCCESS';

export const GROUP_DELETE = '@@group/DELETE';
export const GROUP_DELETE_FAIL = '@@group/DELETE_FAIL';
export const GROUP_DELETE_SUCCESS = '@@group/DELETE_SUCCESS';

export const GROUP_IMPORT = '@@group/IMPORT';
export const GROUP_IMPORT_FAIL = '@@group/IMPORT_FAIL';
export const GROUP_IMPORT_SUCCESS = '@@group/IMPORT_SUCCESS';


export const GROUP_EXPORT = '@@group/EXPORT';
export const GROUP_EXPORT_FAIL = '@@group/EXPORT_FAIL';
export const GROUP_EXPORT_SUCCESS = '@@group/EXPORT_SUCCESS';

export const GROUP_SAVEAS = '@@group/SAVEAS';
export const GROUP_SAVEAS_FAIL = '@@group/SAVEAS_FAIL';
export const GROUP_SAVEAS_SUCCESS = '@@group/SAVEAS_SUCCESS';

export const groupFetch = () => ({
  type: GROUP_FETCH,
  context: {},
  payload:{
    request:{
      method: 'POST',
      url:`/groupFetch`,
    }
  }
})

export const groupAdd = (
  groupInfo,
  ) => ({
  type: GROUP_ADD,
  context: {
    groupInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/groupAdd`,
      data: {
        'config': groupInfo,
      },
    }
  }
})

export const groupDelete = (
  groupInfo,
  ) => ({
  type: GROUP_DELETE,
  context: {
    groupInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/groupDelete`,
      data: {
        'config': groupInfo,
      },
    }
  }
})


export const groupImport = (
  groupInfo,
  ) => ({
  type: GROUP_IMPORT,
  context: {
    groupInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/groupImport`,
      data: {
        'config': groupInfo,
      },
    }
  }
})

export const groupExport = (
  groupInfo,
  ) => ({
  type: GROUP_EXPORT,
  context: {
    groupInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/groupExport`,
      data: {
        'config': groupInfo,
      },
    }
  }
})

export const groupSaveAs = (
  groupInfo,
  ) => ({
  type: GROUP_SAVEAS,
  context: {
    groupInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/groupSaveAs`,
      data: {
        'config': groupInfo,
      },
    }
  }
})