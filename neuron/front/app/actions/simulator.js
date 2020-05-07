export const SIMULATOR_MAKE = '@@simulator/MAKE';
export const SIMULATOR_MAKE_FAIL = '@@simulator/MAKE_FAIL';
export const SIMULATOR_MAKE_SUCCESS = '@@simulator/MAKE_SUCCESS';

export const SIMULATOR_MANIPULATION = '@@simulator/MANIPULATION';
export const SIMULATOR_MANIPULATION_FAIL = '@@simulator/MANIPULATION_FAIL';
export const SIMULATOR_MANIPULATION_SUCCESS = '@@simulator/MANIPULATION_SUCCESS';

export const SIMULATOR_CLICK = '@@simulator/CLICK';
export const SIMULATOR_CLICK_FAIL = '@@simulator/CLICK_FAIL';
export const SIMULATOR_CLICK_SUCCESS = '@@simulator/CLICK_SUCCESS';

export const SIMULATOR_DEBUG = '@@simulator/DEBUG';
export const SIMULATOR_DEBUG_FAIL = '@@simulator/DEBUG_FAIL';
export const SIMULATOR_DEBUG_SUCCESS = '@@simulator/DEBUG_SUCCESS';


export const simulatorMaker = (
    simulatorInfo,
  ) => ({
  type: SIMULATOR_MAKE,
  context: {
    simulatorInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/simulatorMaker`,
      data: {
        'config': simulatorInfo,
      },
    }
  }
})

export const simulatorManipulation = (
    manipulationInfo,
  ) => ({
  type: SIMULATOR_MANIPULATION,
  context: {
    manipulationInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/SimulatorManipulation`,
      data: {
        'config': manipulationInfo,
      },
    }
  }
})

export const simulatorClickInput = (
    clickInfo,
  ) => ({
  type: SIMULATOR_CLICK,
  context: {
    clickInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/SimulatorClickInput`,
      data: {
        'config': clickInfo,
      },
    }
  }
})

export const simulatorDebugSetting = (
    debugInfo,
  ) => ({
  type: SIMULATOR_DEBUG,
  context: {
    debugInfo,
  },
  payload:{
    request:{
      method: 'POST',
      url:`/SimulatorDebugSetting`,
      data: {
        'config': debugInfo,
      },
    }
  }
})
