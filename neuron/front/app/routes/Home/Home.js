// @flow
import {
  setPageLoading,

  graphAdd,
  graphDelete,
  graphExport,
  graphSaveAs,
  graphFetch,

  modelFetch,
  modelAdd,
  modelDelete,
  modelImport,
  modelExport,
  modelSaveAs,

  groupFetch,
  groupAdd,
  groupDelete,
  groupImport,
  groupExport,
  groupSaveAs,

  networkFetch,
  networkAdd,
  networkDelete,
  networkImport,
  networkExport,
  networkSaveAs,

  simulatorMaker,
  simulatorManipulation,
  simulatorClickInput,
  simulatorDebugSetting,

} from 'actions';

import {
  Col,
  Container,
  Input,
  Row,
  ButtonGroup,
  Button,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu, } from 'components';

import styles from './component/commonStyle.scss';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import {
  GraphInitializeMaker,
  NeuronModelMaker,
  NeuronGroupMaker,
  NeuronNetworkMaker,
  Simulator,
} from './component';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3030')

class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      view: 'simulator',
      refreshTensorboard:0,

      graphInitializationList:{},
      nowGraphInitializationId:0,

      neuronModelList:{},
      nowNeuronModelId:0,
      nowNeuronModelGraph: { nodes:[], edges: [] },

      neuronGroupList:{},
      nowNeronGroupId:0,
      nowNeuronGroupGraph: { nodes:[], edges: [] },

      neuronNetworkList:{},
      nowNeronNetworkId:0,
      nowNeuronNetworkGraph: { nodes:[], edges: [] },

      debugInfo: {},
    };

  }

  componentDidMount() {
    this.props.setPageLoading(false);
    socket.on('debug_include',(node_name)=>{
      this.props.simulatorDebugSetting({
        mode:"debug_include",
        data:node_name,
      })

    })
  }

  componentWillReceiveProps(nextProps) {

   this.setState({
      ...this.state,

      nowNeuronModelGraph: nextProps.data.modelGraph,
      nowNeuronGroupGraph: nextProps.data.groupGraph,
      nowNeuronNetworkGraph: nextProps.data.networkGraph,

      graphInitializationList: nextProps.data.graphList,
      neuronModelList: nextProps.data.modelList,
      neuronGroupList: nextProps.data.groupList,
      neuronNetworkList: nextProps.data.networkList,
    })
  }



  setNowNeuronModelId = (id) => {
    this.setState({
      ...this.state,
      nowNeuronModelId: id,
    })
  }

  setNowNeuronGroupId = (id) => {
    this.setState({
      ...this.state,
      nowNeuronGroupId: id,
    })
  }


  setNowNeuronNetworkId = (id) => {
    this.setState({
      ...this.state,
      nowNeuronNetworkId: id,
      refreshTensorboard: this.state.refreshTensorboard+1,
    })
  }

  setNowGraphInitializationId = (id) => {
    this.setState({
      ...this.state,
      nowGraphInitializationId: id,
    })
  }


  render() {

    console.log('home_state')
    console.log(this.state)
    console.log('home_props')
    console.log(this.props)


    return (
      <div>
        <Row>
        <ButtonGroup>

          <Button
            style={{'width':'13vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'graphInitializeMaker'}
            onClick={() => this.setState(
              {
                view: 'graphInitializeMaker',
                nowGraphInitializationId:0,
              })}
          >
            Graph Initialize Maker
          </Button>
          <Button
            style={{'width':'13vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'neuronModelMaker'}
            onClick={() => this.setState({
              view: 'neuronModelMaker',
              nowNeuronModelId:0,
            })}
          >
            Neuron Model Maker
          </Button>
          <Button
            style={{'width':'13vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'neuronGroupMaker'}
            onClick={() => this.setState({
              view: 'neuronGroupMaker',
              nowNeuronGroupId:0,
            })}
          >
            Neuron Group Maker
          </Button>
          <Button
            style={{'width':'13vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'neuronNetworkMaker'}
            onClick={() => this.setState({
              view: 'neuronNetworkMaker',
              nowNeuronNetworkId:0,
            })}
          >
            Neuron Network Maker
          </Button>
          <Button
            style={{'width':'11vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'simulator'}
            onClick={() =>{
              this.setState({
                view: 'simulator'
              });}
            }
          >
            Simulator
          </Button>
          <Button
            style={{'width':'12vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'simulator'}
            onClick={() =>{
              this.setState({
                view: 'simulator'
              });}
            }
          >
            Object Maker
          </Button>
          <Button
            style={{'width':'12vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'simulator'}
            onClick={() =>{
              this.setState({
                view: 'simulator'
              });}
            }
          >
            Heredity simualtor
          </Button>
          <Button
            style={{'width':'12vw'}}
            color="secondary"
            className="text-white"
            outline
            active={this.state.view === 'simulator'}
            onClick={() =>{
              this.setState({
                view: 'simulator'
              });}
            }
          >
            Heredity space
          </Button>

        </ButtonGroup>
        </Row>
        <Row>
          <Card>
          {
            this.state.view === 'graphInitializeMaker' ?(
              <CardBody style={{'width':'98vw', 'height':'94vh'}}>
                <GraphInitializeMaker
                  graphFetch={this.props.graphFetch}
                  graphAdd={this.props.graphAdd}
                  graphSaveAs={this.props.graphSaveAs}
                  graphExport={this.props.graphExport}
                  graphDelete={this.props.graphDelete}

                  setNowGraphInitializationId={this.setNowGraphInitializationId}

                  graphInitializationList={this.state.graphInitializationList}
                  nowGraphInitializationId={this.state.nowGraphInitializationId}
                />
              </CardBody>
            ): this.state.view === 'neuronModelMaker' ?(
              <CardBody style={{'width':'98vw', 'height':'94vh'}}>
                <NeuronModelMaker
                  modelFetch={this.props.modelFetch}
                  modelAdd={this.props.modelAdd}
                  modelSaveAs={this.props.modelSaveAs}
                  modelExport={this.props.modelExport}
                  modelDelete={this.props.modelDelete}
                  modelImport={this.props.modelImport}

                  setNowNeuronModelId={this.setNowNeuronModelId}
                  neuronModelList={this.state.neuronModelList}
                  nowNeuronModelId={this.state.nowNeuronModelId}
                  nowNeuronModelGraph={this.state.nowNeuronModelGraph}

                  setNowGraphInitializationId={this.setNowGraphInitializationId}
                  nowGraphInitializationId={this.state.nowGraphInitializationId}

                  graphFetch={this.props.graphFetch}
                  graphInitializationList={this.state.graphInitializationList}
                />
              </CardBody>
            ): this.state.view === 'neuronGroupMaker' ?(
              <CardBody style={{'width':'98vw', 'height':'94vh'}}>
                <NeuronGroupMaker
                  groupFetch={this.props.groupFetch}
                  groupAdd={this.props.groupAdd}
                  groupSaveAs={this.props.groupSaveAs}
                  groupExport={this.props.groupExport}
                  groupDelete={this.props.groupDelete}
                  groupImport={this.props.groupImport}

                  setNowNeuronGroupId={this.setNowNeuronGroupId}
                  neuronGroupList={this.state.neuronGroupList}
                  nowNeuronGroupId={this.state.nowNeuronGroupId}
                  nowNeuronGroupGraph={this.state.nowNeuronGroupGraph}

                  modelFetch={this.props.modelFetch}
                  nowNeuronModelId={this.state.nowNeuronModelId}
                  setNowNeuronModelId={this.setNowNeuronModelId}
                  neuronModelList={this.state.neuronModelList}
                  />
              </CardBody>
            ): this.state.view === 'neuronNetworkMaker' ?(
              <CardBody style={{'width':'98vw', 'height':'94vh'}}>
                <NeuronNetworkMaker
                  networkFetch={this.props.networkFetch}
                  networkAdd={this.props.networkAdd}
                  networkSaveAs={this.props.networkSaveAs}
                  networkExport={this.props.networkExport}
                  networkDelete={this.props.networkDelete}
                  networkImport={this.props.networkImport}

                  setNowNeuronNetworkId={this.setNowNeuronNetworkId}
                  neuronNetworkList={this.state.neuronNetworkList}
                  nowNeuronNetworkId={this.state.nowNeuronNetworkId}
                  nowNeuronNetworkGraph={this.state.nowNeuronNetworkGraph}

                  groupFetch={this.props.groupFetch}
                  nowNeuronGroupId={this.state.nowNeuronGroupId}
                  setNowNeuronGroupId={this.setNowNeuronGroupId}
                  neuronGroupList={this.state.neuronGroupList}


                  />
              </CardBody>
            ): this.state.view === 'simulator' ?(
              <CardBody style={{'width':'98vw', 'height':'94vh'}}>
                <Simulator
                  networkFetch={this.props.networkFetch}
                  simulatorMaker={this.props.simulatorMaker}
                  simulatorManipulation={this.props.simulatorManipulation}
                  simulatorClickInput={this.props.simulatorClickInput}
                  simulatorDebugSetting={this.props.simulatorDebugSetting}

                  neuronNetworkList={this.state.neuronNetworkList}

                  setNowNeuronNetworkId={this.setNowNeuronNetworkId}
                  nowNeuronNetworkId={this.state.nowNeuronNetworkId}

                  refreshTensorboard={this.state.refreshTensorboard}
                  debugShow={this.props.data.debugShow}




                />
              </CardBody>
            ):(null)
          }
          </Card>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPageLoading: (loading: boolean) => dispatch(setPageLoading(loading)),

  graphFetch: (): Promise<Object> => dispatch(graphFetch()),
  graphAdd: (graphInfo): Promise<Object> => dispatch(graphAdd(graphInfo)),
  graphDelete: (graphInfo): Promise<Object> => dispatch(graphDelete(graphInfo)),
  graphExport: (graphInfo): Promise<Object> => dispatch(graphExport(graphInfo)),
  graphSaveAs: (graphInfo): Promise<Object> => dispatch(graphSaveAs(graphInfo)),

  modelFetch: (): Promise<Object> => dispatch(modelFetch()),
  modelAdd: (modelInfo): Promise<Object> => dispatch(modelAdd(modelInfo)),
  modelDelete: (modelInfo): Promise<Object> => dispatch(modelDelete(modelInfo)),
  modelImport: (modelInfo): Promise<Object> => dispatch(modelImport(modelInfo)),
  modelExport: (modelInfo): Promise<Object> => dispatch(modelExport(modelInfo)),
  modelSaveAs: (modelInfo): Promise<Object> => dispatch(modelSaveAs(modelInfo)),

  groupFetch: (): Promise<Object> => dispatch(groupFetch()),
  groupAdd: (groupInfo): Promise<Object> => dispatch(groupAdd(groupInfo)),
  groupDelete: (groupInfo): Promise<Object> => dispatch(groupDelete(groupInfo)),
  groupImport: (groupInfo): Promise<Object> => dispatch(groupImport(groupInfo)),
  groupExport: (groupInfo): Promise<Object> => dispatch(groupExport(groupInfo)),
  groupSaveAs: (groupInfo): Promise<Object> => dispatch(groupSaveAs(groupInfo)),

  networkFetch: (): Promise<Object> => dispatch(networkFetch()),
  networkAdd: (networkInfo): Promise<Object> => dispatch(networkAdd(networkInfo)),
  networkDelete: (networkInfo): Promise<Object> => dispatch(networkDelete(networkInfo)),
  networkImport: (networkInfo): Promise<Object> => dispatch(networkImport(networkInfo)),
  networkExport: (networkInfo): Promise<Object> => dispatch(networkExport(networkInfo)),
  networkSaveAs: (networkInfo): Promise<Object> => dispatch(networkSaveAs(networkInfo)),

  simulatorMaker: (simulatorInfo): Promise<Object> => dispatch(simulatorMaker(simulatorInfo)),
  simulatorManipulation: (manipulationInfo): Promise<Object> => dispatch(simulatorManipulation(manipulationInfo)),
  simulatorClickInput: (clickInfo): Promise<Object> => dispatch(simulatorClickInput(clickInfo)),
  simulatorDebugSetting: (debugInfo): Promise<Object> => dispatch(simulatorDebugSetting(debugInfo)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
