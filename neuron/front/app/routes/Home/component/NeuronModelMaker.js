// @flow
import '!style-loader!css-loader!rc-slider/assets/index.css';
import Slider from 'rc-slider';

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

import styles from './commonStyle.scss';
import _ from 'lodash';
import React from 'react';

import Graph from "react-graph-vis";
import MathJax from 'react-mathjax2'


class neuronModelMaker extends React.Component {

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
          enabled: false,
        },
        interaction: { multiselect: true, dragView: true },
        manipulation: {
          enabled: true, initiallyActive: true,
          addNode: this.addNodeCallBackFunc,
          deleteNode: this.deleteNodeCallBackFunc,
          addEdge: this.addEdgeCallBackFunc,
          deleteEdge: this.deleteEdgeCallBackFunc,
          editEdge: this.editEdgeCallBackFunc,
        }
      },
      events : {
        selectNode:this.selectNodeCallBackFunc,
        deselectNode:this.deSelectNodeCallBackFunc,
        selectEdge:this.selectEdgeCallBackFunc,
      },
      selectInitialGraph:0,
      selectingNode:false,
      selectingEdge:false,
      selectNode:{},
      selectEdge:{},
      traceNetwork:{ nodes:[], edges: [] },
    };

    this.setNetworkInstance = this.setNetworkInstance.bind(this);
  }

  componentDidMount() {
    this.props.modelFetch();
    this.props.graphFetch();
  }

  setNetworkInstance =(nw) => {
      this.setState({
            network: nw,
        });
  };

  componentWillReceiveProps(nextProps) {

      if(this.props.nowNeuronModelGraph !=nextProps.nowNeuronModelGraph) {
        this.setState({
          ...this.state,
          traceNetwork: nextProps.nowNeuronModelGraph,
        })
      }

  }

  addNodeCallBackFunc = (nodeData,callback) =>{
    console.log('addNode!')

    var nodeName = prompt('Node Name :');
    nodeData.label = nodeName

    console.log(nodeData)

    var newNodes = this.state.traceNetwork.nodes

    var newNodeData = {
      ...nodeData,
      description:"new Node named ["+nodeName+"]",
      localOrGlobal:"global",
      inputOrOutput:"inner",
      descriptionType:"ion",
      initialValue:0.1,
    }

    newNodes.push(newNodeData)

    this.setState({
      ...this.state,
      traceNetwork:{
        ...this.state.traceNetwork,
        nodes:newNodes,
      }
    })

    callback(nodeData)
  }

  deleteNodeCallBackFunc = (graphData,callback) =>{
    console.log('deleteNode!')

    console.log(graphData)

    var newNodes = this.state.traceNetwork.nodes.filter(node => node.id != graphData.nodes[0])
    console.log(newNodes)

    var newEdges = this.state.traceNetwork.edges
    graphData.edges.map(deleteEdge => {
      newEdges = newEdges.filter(edge => edge.id!= deleteEdge)
    })


    this.setState({
      ...this.state,
      traceNetwork:{
        nodes:newNodes,
        edges:newEdges,
      }
    })

    callback(graphData)
  }

  addEdgeCallBackFunc = (edgeData,callback) =>{
    console.log('addEdge!')

    console.log(edgeData)

    var newEdges = this.state.traceNetwork.edges

    const initialParameter={
        0:{
          "id": 0,
          "name":"x^5",
          "value":0.00000,
          "lock":false,
        },
        1:{
          "id": 1,
          "name":"x^4",
          "value":0.00000,
          "lock":false,
        },
        2:{
          "id": 2,
          "name":"x^3",
          "value":0.00000,
          "lock":false,
        },
        3:{
          "id": 3,
          "name":"x^2",
          "value":0.00000,
          "lock":false,
        },
        4:{
          "id": 4,
          "name":"x^1",
          "value":0.00000,
          "lock":false,
        },
        5:{
          "id": 5,
          "name":"x^0",
          "value":0.00000,
          "lock":true,
        },
      }

    const fromStr = this.state.traceNetwork.nodes.filter(node => node.id == edgeData.from)[0].label
    const toStr = this.state.traceNetwork.nodes.filter(node => node.id == edgeData.to)[0].label

    var newEdgeData = {
      ...edgeData,
      description:"new Edge : "+fromStr+" -> "+toStr,
      type:"diffusion",
      f_x:initialParameter,
      y_x:initialParameter,
      z_x:initialParameter,
    }

    newEdges.push(newEdgeData)

    this.setState({
      ...this.state,
      traceNetwork:{
        ...this.state.traceNetwork,
        edges:newEdges,
      }
    })

    callback(edgeData)
  }

  deleteEdgeCallBackFunc = (edgeData,callback) =>{
    console.log('deleteEdge!')

    console.log(edgeData)

    var newEdges = this.state.traceNetwork.edges.filter(edge => edge.id != edgeData.edges[0])

    this.setState({
      ...this.state,
      traceNetwork:{
        ...this.state.traceNetwork,
        edges:newEdges,
      }
    })

    callback(edgeData)
  }

  editEdgeCallBackFunc = (edgeData,callback) =>{
    console.log('editEdge!')

    console.log(edgeData)

    var newEdges = this.state.traceNetwork.edges.filter(edge => edge.id != edgeData.id)

    var editedEdge = this.state.traceNetwork.edges.filter(edge => edge.id == edgeData.id)[0]

    var newEdgeData = {
      ...editedEdge,
      ...edgeData,
      description:"edit Edge",
    }
    newEdges.push(newEdgeData)

    this.setState({
      ...this.state,
      traceNetwork:{
        ...this.state.traceNetwork,
        edges:newEdges,
      }
    })

    callback(edgeData)
  }



  selectNodeCallBackFunc = (nodeData)=>{
    console.log("selectNode!")
    console.log(nodeData)
    this.setState({
      ...this.state,
      selectingNode:true,
      selectingEdge:false,
      selectNode:nodeData.nodes[0],
    })
  }

  deSelectNodeCallBackFunc = ()=>{
    console.log("deSelectNode!")
    this.setState({
      ...this.state,
      selectingNode:false,
    })
  }

  selectEdgeCallBackFunc = (edgeData)=>{
    console.log("selectEdge!")
    console.log(edgeData)

    var selectedEdgeInfo = this.state.traceNetwork.edges.filter(edge=>edge.id == edgeData.edges[0])[0]
    if(this.state.selectingEdge == false){
        this.setState({
        ...this.state,
        selectingEdge:true,
        selectEdge:selectedEdgeInfo,

      })
    }
  }



  render() {

    console.log('neuron_state')
    console.log(this.state)
    console.log('neuron_props')
    console.log(this.props)

    const ascii = 'U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))'
    const content = `This can be dynamic text (e.g. user-entered) text with ascii math embedded in $$ symbols like $$${ascii}$$`


    return (
      <div>
        <Row style = {{"margin": "0px"}}>
        <Col xs={1} sm={1} md={2} style = {{"padding": "0px"}}>
          <ButtonGroup>
            <Button
              style={{'width':'5vw', "backgroundColor": "#f27f87"}}
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
              style={{'width':'5vw', "backgroundColor": "#37B940"}}
              className="text-white"
              outline
              onClick={() => {
                var modelName = prompt('Model Name :');
                this.props.modelSaveAs({
                  modelName: modelName,
                  nodes:this.state.traceNetwork.nodes,
                  edges:this.state.traceNetwork.edges,
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
              style={{'width':'5vw', "backgroundColor": "#30BDB4"}}
              className="text-white"
              outline
              onClick={() => {
                console.log(this.state.network)
                this.props.modelExport({
                  modelInfo:this.props.neuronModelList[this.props.nowNeuronModelId],
                  nodes:this.state.traceNetwork.nodes,
                  edges:this.state.traceNetwork.edges,
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
          <ListGroup style = {{ width :"15vw"}}>
            {
              _.map(this.props.neuronModelList, (modelInfo, index) => (
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
                    modelInfo.id == this.props.nowNeuronModelId ? (
                    <ListGroupItem
                      key={index}
                      style={{ "backgroundColor": "#16E7E5", margin: "2px", width: "13vw" }}
                      tag="button"
                      onClick={() => {
                        this.props.modelImport(modelInfo).then(()=> this.props.setNowNeuronModelId(modelInfo.id));
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
                      style={{ "backgroundColor": "#354D4D", margin: "2px", width: "13vw" }}
                      tag="button"
                      onClick={() => {
                        this.props.modelImport(modelInfo).then(()=> this.props.setNowNeuronModelId(modelInfo.id));
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
           <div className={styles.cardBody} id="graph" style={{ height: "82vh", width : "47vw" }}>
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.19.1/vis-network.min.css"/>
              <Graph
                getNetwork={this.setNetworkInstance}
                graph={this.props.nowNeuronModelGraph}
                options={this.state.options}
                events={this.state.events}
              />
            </div>
        </Col>
          {
            this.state.selectingEdge == true ?(
              <Col xs={5} sm={5} md={2}>

                <h5 style={{width:'15vw'}}><i className="fa fa-book"/>   Description : </h5>
                <Input
                  placeholder=""
                  value={this.state.selectEdge.description}
                  onChange = {(e)=>this.onChangeParameterByValue(e.target.value)}
                >
                </Input>

                <ButtonGroup>
                  <Button
                    style={{ 'width': '5vw', "backgroundColor": "#354D4D" }}
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
            ):(
              <Col xs={5} sm={5} md={2}>

                <ButtonGroup>
                  <Button
                    style={{ 'width': '5vw', "backgroundColor": "#354D4D" }}
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
            )
          }
          <Col xs={5} sm={5} md={2}>
            <ListGroup style = {{ width :"15vw"}}>
              {
                _.map(this.props.graphInitializationList, (graphInfo, index) => (
                  <Row>
                    {
                      graphInfo.id == this.props.nowGraphInitializationId ? (
                      <ListGroupItem
                        key={index}
                        style={{ "backgroundColor": "#9f92ca", margin: "2px", width: "15vw" }}
                        tag="button"
                        onClick={() => {
                          this.props.setNowGraphInitializationId(graphInfo.id);
                        }}
                        action href="#">
                      <span className="ml-1 text-inverse"
                            ref={(el) => {
                              if (el) {
                                el.style.setProperty('color', '#000000', 'important');
                              }
                            }}>
                        <MathJax.Context input='ascii'><MathJax.Node inline>{ graphInfo.name }</MathJax.Node></MathJax.Context>
                      </span>
                      </ListGroupItem>) :(
                        <ListGroupItem
                        key={index}
                        style={{ "backgroundColor": "#2f2b3c", margin: "2px", width: "15vw" }}
                        tag="button"
                        onClick={() => {
                          this.props.setNowGraphInitializationId(graphInfo.id);
                        }}
                        action href="#">
                      <span className="ml-1 text-inverse"
                            ref={(el) => {
                              if (el) {
                                el.style.setProperty('color', '#000000', 'important');
                              }
                            }}>
                        <MathJax.Context input='ascii'><MathJax.Node inline>{ graphInfo.name }</MathJax.Node></MathJax.Context>
                      </span>
                      </ListGroupItem>
                      )

                    }

                  </Row>
                ))
              }
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default neuronModelMaker;
