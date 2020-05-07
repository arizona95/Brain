// @flow
import {
  setPageLoading,

  modelImport,
  modelExport,
  modelSaveAs,
  modelFetch,
  modelAdd,
  modelDelete,

  graphExport,
  graphSaveAs,
  graphFetch,
  graphAdd,
  graphDelete,

  networkFetch,
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
  NeuronModelMaker,
  GraphInitializeMaker,
  Simulator,
  NeuronNetworkMaker,
} from './component';


import Graph from "react-graph-vis";
import MathJax from 'react-mathjax2'


class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      view: 'neuronNetworkMaker',
      neuronModelList:{},
      nowNeuronModelId:0,
      nowNeuronModelGraph: { nodes:[], edges: [] },

      graphInitializationList:{},
      nowGraphInitializationId:0,

      neuronNetworkList:{},
      nowNeronNetworkId:0,

    };

  }

  componentDidMount() {
    this.props.setPageLoading(false);
  }

  componentWillReceiveProps(nextProps) {

   this.setState({
      ...this.state,
      neuronModelList: nextProps.data.modelList,
      nowNeuronModelGraph: nextProps.data.graph,

      graphInitializationList: nextProps.data.graphList,
      neuronNetworkList: nextProps.data.networkList,
    })
  }



  setNowNeuronModelId = (id) => {
    this.setState({
      ...this.state,
      nowNeuronModelId: id,
    })
  }

  setNowNeuronNetworkId = (id) => {
    this.setState({
      ...this.state,
      nowNeuronNetworkId: id,
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
            active={this.state.view === 'neuronNetworkMaker'}
            onClick={() => this.setState({
              view: 'neuronNetworkMaker'
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
            ): this.state.view === 'neuronNetworkMaker' ?(
              <CardBody style={{'width':'98vw', 'height':'94vh'}}>
                <NeuronNetworkMaker
                  networkFetch={this.props.networkFetch}
                  neuronNetworkList={this.state.neuronNetworkList}

                  setNowNeuronNetworkId={this.setNowNeuronNetworkId}
                  nowNeuronNetworkId={this.state.nowNeuronNetworkId}
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


  modelImport: (modelInfo): Promise<Object> => dispatch(modelImport(modelInfo)),
  modelExport: (modelInfo): Promise<Object> => dispatch(modelExport(modelInfo)),
  modelSaveAs: (modelInfo): Promise<Object> => dispatch(modelSaveAs(modelInfo)),

  modelFetch: (): Promise<Object> => dispatch(modelFetch()),
  modelAdd: (modelInfo): Promise<Object> => dispatch(modelAdd(modelInfo)),
  modelDelete: (modelInfo): Promise<Object> => dispatch(modelDelete(modelInfo)),

  graphExport: (graphInfo): Promise<Object> => dispatch(graphExport(graphInfo)),
  graphSaveAs: (graphInfo): Promise<Object> => dispatch(graphSaveAs(graphInfo)),

  graphFetch: (): Promise<Object> => dispatch(graphFetch()),
  graphAdd: (graphInfo): Promise<Object> => dispatch(graphAdd(graphInfo)),
  graphDelete: (graphInfo): Promise<Object> => dispatch(graphDelete(graphInfo)),

  networkFetch: (): Promise<Object> => dispatch(networkFetch()),
  simulatorMaker: (simulatorInfo): Promise<Object> => dispatch(simulatorMaker(simulatorInfo)),
  simulatorManipulation: (manipulationInfo): Promise<Object> => dispatch(simulatorManipulation(manipulationInfo)),
  simulatorClickInput: (clickInfo): Promise<Object> => dispatch(simulatorClickInput(clickInfo)),
  simulatorDebugSetting: (debugInfo): Promise<Object> => dispatch(simulatorDebugSetting(debugInfo)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
