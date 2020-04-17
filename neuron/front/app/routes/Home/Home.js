// @flow
import { setPageLoading,
  modelImport,
  modelExport,
  modelSaveAs,
  modelFetch,
  modelAdd,
  modelDelete, } from 'actions';

import { Col, Container, Input, Row, ButtonGroup, Button, Card, CardBody, ListGroup, ListGroupItem,
  UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, } from 'components';
import styles from './component/commonStyle.scss';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import {
  DataCollector,
  DataGenerate,
  DataLoad,
  DataQualityEvaluation,
  DataQualityView,
  FeatureSelect,
  MLAlgorithm,
  SelectModel,
} from './component';
import addLogo from 'components/logo/addlogo.png';

import Graph from "react-graph-vis";


class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      options: {
        layout: {
          // hierarchical: true,
        },
        edges: {
          color: "#000000"
        },
        nodes: {
          color: "#888f99"
        },
        physics: {
          enabled: true
        },
        interaction: { multiselect: true, dragView: true },
        manipulation: {
           enabled: true, initiallyActive: true, addEdge: true, editEdge : true,
          addNode: (nodeData,callback) =>{
           console.log('123')
            console.log(nodeData)
            callback(nodeData)
          },
          deleteNode: (nodeData,callback) =>{
           console.log('456')
            console.log(nodeData)
            callback(nodeData)
          },
        }
      },
      events : {
      },
      neuronModelList:{},
      nowNeuronModelId:0,
      nowNeuronModelGraph: { nodes:[], edges: [] },
    };

    this.setNetworkInstance = this.setNetworkInstance.bind(this);
  }

  componentDidMount() {
    this.props.setPageLoading(false);
    this.props.modelFetch();
    document.addEventListener("mousedown", e => {});
    document.addEventListener("mousemove", e => {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      neuronModelList: nextProps.data.modelList,
      nowNeuronModelGraph: nextProps.data.graph,
    })
  }


  setNetworkInstance =(nw) => {
      this.setState({
            network: nw,
        });
  };



  render() {

    console.log('home_state')
    console.log(this.state)
    console.log('home_props')
    console.log(this.props)





    return (
      <div>
        <Row style = {{"margin": "0px"}}>
        <Col xs={1} sm={1} md={1} style = {{"padding": "0px"}}>
          <ButtonGroup>
            <Button
              style={{'width':'2vw', "backgroundColor": "#354D4D"}}
              className="text-white"
              outline
              onClick={() => {
                var modelName = prompt('Model Name :');
                this.props.modelAdd({ modelName: modelName }).then(()=>this.props.modelFetch());
              }}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('color', '#ffffff', 'important');
                        }
                      }}>
                  <i className="fa fa-plus"/></span>
            </Button>
            <Button
              style={{'width':'3vw', "backgroundColor": "#37B940"}}
              className="text-white"
              outline
              onClick={() => {
                var modelName = prompt('Model Name :');
                this.props.modelSaveAs({
                  modelName: modelName,
                  nodes:this.state.network.body.data.nodes._data,
                  edges:this.state.network.body.data.edges._data,
                }).then(()=>this.props.modelFetch());
              }}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('color', '#ffffff', 'important');
                        }
                      }}>
                  <i className="fa fa-paste (alias)"/></span>
            </Button>
            <Button
              style={{'width':'3vw', "backgroundColor": "#30BDB4"}}
              className="text-white"
              outline
              onClick={() => {
                console.log(this.state.network)
                this.props.modelExport({
                  modelInfo:this.state.neuronModelList[this.state.nowNeuronModelId],
                  nodes:this.state.network.body.data.nodes._data,
                  edges:this.state.network.body.data.edges._data,
                });
              }}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('color', '#ffffff', 'important');
                        }
                      }}>
                  <i className="fa fa-save (alias)"/></span>
            </Button>
          </ButtonGroup>
          <ListGroup style = {{ width :"8vw", marginRight:"6px"}}>
            {
              _.map(this.state.neuronModelList, (modelInfo, index) => (
                <Row>
                  <UncontrolledButtonDropdown style = {{ width :"2.5vw"}}>
                      <DropdownToggle color="secondary" outline caret>
                        <i className="fa fa-gear"/>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          data-id={index}
                          onClick={()=>this.props.modelDelete(modelInfo).then(
                            ()=>this.props.modelFetch()
                          )}
                        >
                          <span className="text-danger">
                            <i className="fa fa-fw fa-remove mr-2"/>
                            모델 삭제
                          </span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  {
                    modelInfo.id == this.state.nowNeuronModelId ? (
                    <ListGroupItem
                      key={index}
                      style={{ "backgroundColor": "#16E7E5", margin: "2px", width: "6vw" }}
                      tag="button"
                      onClick={() => {
                        this.props.modelImport(modelInfo).then(()=>{
                          this.setState({ ...this.state, nowNeuronModelId: modelInfo.id })
                        });
                      }}
                      action href="#">
                    <span className="ml-1 text-inverse"
                          ref={(el) => {
                            if (el) {
                              el.style.setProperty('color', '#000000', 'important');
                            }
                          }}>
                      {modelInfo.name}</span>
                    </ListGroupItem>) :(
                      <ListGroupItem
                      key={index}
                      style={{ "backgroundColor": "#354D4D", margin: "2px", width: "6vw" }}
                      tag="button"
                      onClick={() => {
                        this.props.modelImport(modelInfo).then(()=>{
                          this.setState({ ...this.state, nowNeuronModelId: modelInfo.id })
                        });
                      }}
                      action href="#">
                    <span className="ml-1 text-inverse"
                          ref={(el) => {
                            if (el) {
                              el.style.setProperty('color', '#000000', 'important');
                            }
                          }}>
                      {modelInfo.name}</span>
                    </ListGroupItem>
                    )

                  }

                </Row>
              ))
            }
          </ListGroup>
        </Col>
        <Col xs={6} sm={6} md={6}>
           <div className={styles.cardBody} id="graph" style={{ height: "90vh", width : "48vw" }}>
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.19.1/vis-network.min.css"/>
              <Graph
                getNetwork={this.setNetworkInstance}
                graph={this.state.nowNeuronModelGraph}
                options={this.state.options}
                events={this.state.events}
              />
            </div>
        </Col>
        <Col xs={5} sm={5} md={5}>
          <ButtonGroup>
            <Button
              style={{'width':'5vw', "backgroundColor": "#354D4D"}}
              className="text-white"
              outline
              onClick={() => {
                console.log('buttonClick!')
                console.log(this.state.network)
                console.log(this.state.network.body.data.edges._data)
                console.log(this.state.network.body.data.nodes._data)
              }}
            >test
            </Button>
          </ButtonGroup>
        </Col>

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

});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
