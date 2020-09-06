// @flow
import '!style-loader!css-loader!rc-slider/assets/index.css';

import {
  Button,
  ButtonGroup,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
  Toggle,
  UncontrolledButtonDropdown,
} from 'components';
import d3 from 'd3';
import _ from 'lodash';
import React from 'react';

import Graph from 'react-graph-vis';
import MathJax from 'react-mathjax2';

import styles from './commonStyle.scss';

window.d3 = d3;


class neuronModelMaker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: {
        layout: {
          // hierarchical: true,
        },
        edges: {
          color: '#000000',
        },
        nodes: {
          color: '#888f99',
        },
        physics: {
          enabled: false,
        },
        interaction: { multiselect: true, dragView: true, selectConnectedEdges: false },
        manipulation: {
          enabled: true, initiallyActive: true,
          addNode: this.addNodeCallBackFunc,
          deleteNode: this.deleteNodeCallBackFunc,
          addEdge: this.addEdgeCallBackFunc,
          deleteEdge: this.deleteEdgeCallBackFunc,
          editEdge: this.editEdgeCallBackFunc,
        },
      },
      events: {
        selectNode: this.selectNodeCallBackFunc,
        deselectNode: this.deSelectNodeCallBackFunc,
        selectEdge: this.selectEdgeCallBackFunc,
        deselectEdge: this.deSelectEdgeCallBackFunc,
        dragEnd: this.dragEndNodeCallBackFunc,
      },
      selectInitialGraph: 0,
      selectingNode: false,
      selectingEdge: false,
      selectNodeId: -1,
      selectEdgeId: -1,
      reRenderNeed: false,
      destroyNeed: false,
      traceNetwork: { nodes: [], edges: [] },
    };

    this.setNetworkInstance = this.setNetworkInstance.bind(this);
  }

  componentDidMount() {
    this.props.modelFetch();
    this.props.graphFetch();
  }

  setNetworkInstance = (nw) => {
    this.setState({
      network: nw,
    });
  };

  componentWillReceiveProps(nextProps) {

    if (this.props.nowNeuronModelId != nextProps.nowNeuronModelId) {
      this.setState({
        ...this.state,
        traceNetwork: nextProps.nowNeuronModelGraph,
        selectInitialGraph: 0,
        selectingNode: false,
        selectingEdge: false,
        selectNodeId: -1,
        selectEdgeId: -1,
        reRenderNeed: false,
      });
    } else if (this.props.nowGraphInitializationId != nextProps.nowGraphInitializationId) {
      this.setState({
        ...this.state,
        reRenderNeed: true,
      });
    }

  }

  addNodeCallBackFunc = (nodeData, callback) => {
    console.log('addNode!');

    var nodeName = prompt('Node Name :');
    nodeData.label = nodeName;

    console.log(nodeData);

    var newNodes = this.state.traceNetwork.nodes;

    var newNodeData = {
      ...nodeData,
      description: 'new Node named [' + nodeName + ']',
      locality: 'Local',
      role: '@Inner',
      shape: 'image',
      image: 'http://localhost:3030/static/neuronElement/Else.png',
      group: 'Else',
      initial: 0.1,
      bound_max: 1,
      bound_min: 0,
      Random: 0,
    };

    newNodes.push(newNodeData);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        nodes: newNodes,
      },
    });

    callback(newNodeData);
  };

  deleteNodeCallBackFunc = (graphData, callback) => {
    console.log('deleteNode!');

    console.log(graphData);

    var newNodes = this.state.traceNetwork.nodes.filter(node => node.id != graphData.nodes[0]);
    console.log(newNodes);

    var newEdges = this.state.traceNetwork.edges;
    newEdges = newEdges.filter(edge => edge.from != graphData.nodes[0] && edge.to != graphData.nodes[0]);

  
    this.setState({
      ...this.state,
      traceNetwork: {
        nodes: newNodes,
        edges: newEdges,
      },
      selectingNode: false,
      selectNodeId: -1,
    });

    callback(graphData);
  };

  addEdgeCallBackFunc = (edgeData, callback) => {
    console.log('addEdge!');

    console.log(edgeData);

    // if edge exist, continue
    if( this.state.traceNetwork.edges.filter(edge => edge.from == edgeData.from && edge.to == edgeData.to ).length !=0 ) return

    var date = new Date();
    var components = [
      date.getYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ];

    var id = components.join('');

    edgeData = { ...edgeData, id: id };

    var newEdges = this.state.traceNetwork.edges;

    const initialParameter = {
      0: {
        'id': 0,
        'name': 'x^5',
        'value': 0.00000,
        'lock': false,
      },
      1: {
        'id': 1,
        'name': 'x^4',
        'value': 0.00000,
        'lock': false,
      },
      2: {
        'id': 2,
        'name': 'x^3',
        'value': 0.00000,
        'lock': false,
      },
      3: {
        'id': 3,
        'name': 'x^2',
        'value': 0.00000,
        'lock': false,
      },
      4: {
        'id': 4,
        'name': 'x^1',
        'value': 0.00000,
        'lock': false,
      },
      5: {
        'id': 5,
        'name': 'x^0',
        'value': 0.00000,
        'lock': true,
      },
    };

    const fromStr = this.state.traceNetwork.nodes.filter(node => node.id == edgeData.from)[0].label;
    const toStr = this.state.traceNetwork.nodes.filter(node => node.id == edgeData.to)[0].label;

    var newEdgeData = {
      ...edgeData,
      description: 'new Edge : ' + fromStr + ' -> ' + toStr,
      type: 'diffusion',
      R_x: initialParameter,
      D_x: initialParameter,
      F_x: initialParameter,
    };

    if( this.state.traceNetwork.edges.filter(edge => edge.from == edgeData.to && edge.to == edgeData.from ).length !=0 )
    {
      newEdgeData = {
        ...newEdgeData,
        smooth:{
          'enabled':true,
          'type':'curvedCW',
          'roundness':0.1,
        }
      }

      var mappingEdge = this.state.traceNetwork.edges.filter(edge => edge.from == edgeData.to && edge.to == edgeData.from )[0]
      newEdges = newEdges.filter(edge => edge.from != edgeData.to || edge.to != edgeData.from )

      mappingEdge = {
        ...mappingEdge,
        smooth:{
          'enabled':true,
          'type':'curvedCW',
          'roundness':0.1,
        }
      }
      newEdges.push(mappingEdge)
    }

    newEdges.push(newEdgeData);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        edges: newEdges,
      },
    });

    callback(newEdgeData);
  };

  deleteEdgeCallBackFunc = (edgeData, callback) => {
    console.log('deleteEdge!');

    console.log(edgeData);

    var newEdges = this.state.traceNetwork.edges.filter(edge => edge.id != edgeData.edges[0]);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        edges: newEdges,
      },
      selectingEdge: false,
      selectEdgeId: -1,
    });

    callback(edgeData);
  };

  editEdgeCallBackFunc = (edgeData, callback) => {
    console.log('editEdge!');

    console.log(edgeData);

    var newEdges = this.state.traceNetwork.edges.filter(edge => edge.id != edgeData.id);

    var editedEdge = this.state.traceNetwork.edges.filter(edge => edge.id == edgeData.id)[0];

    var newEdgeData = {
      ...editedEdge,
      ...edgeData,
      description: 'edit Edge',
    };
    newEdges.push(newEdgeData);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        edges: newEdges,
      },
    });

    callback(edgeData);
  };

  dragEndNodeCallBackFunc = (dragData) => {
    console.log('drag End!!!@@@');
    console.log(dragData);
    if (dragData.nodes.length != 0) {
      var traceNetworkNode = this.state.traceNetwork.nodes.filter(node => node.id != dragData.nodes[0]);

      var newtraceNetworkNode = {
        ...this.state.traceNetwork.nodes.filter(node => node.id == dragData.nodes[0])[0],
        x: dragData.pointer.canvas.x,
        y: dragData.pointer.canvas.y,
      };

      traceNetworkNode.push(newtraceNetworkNode);

      this.setState({
        ...this.state,
        traceNetwork: {
          nodes: traceNetworkNode,
          edges: this.state.traceNetwork.edges,
        },
      });
    }
  };

  selectNodeCallBackFunc = (nodeData) => {
    console.log('selectNode!');
    console.log(nodeData);

    this.setState({
      ...this.state,
      selectingNode: true,
      selectNodeId: nodeData.nodes[0],
    });
  };

  deSelectNodeCallBackFunc = () => {
    console.log('deSelectNode!');
    this.setState({
      ...this.state,
      selectingNode: false,
    });
  };

  selectEdgeCallBackFunc = (edgeData) => {
    console.log('selectEdge!');
    console.log(edgeData);

    console.log(this.state.traceNetwork.edges.filter(edge => edge.id == edgeData.edges[0]));

    this.setState({
      ...this.state,
      selectingEdge: true,
      reRenderNeed: true,
      selectEdgeId: edgeData.edges[0],

    });
  };

  deSelectEdgeCallBackFunc = () => {
    console.log('deSelectEdge!');
    this.setState({
      ...this.state,
      selectingEdge: false,
    });
  };

  onClickEdgeParameterChange = (rdf) => {
    var traceNetworkEdge = this.state.traceNetwork.edges.filter(edge => edge.id != this.state.selectEdgeId);

    var newtraceNetworkEdge = { ...this.state.traceNetwork.edges.filter(edge => edge.id == this.state.selectEdgeId)[0] };
    if (rdf == 0) {
      newtraceNetworkEdge = {
        ...newtraceNetworkEdge,
        R_x: this.props.graphInitializationList[this.props.nowGraphInitializationId].parameter,
      };
    } else if (rdf == 1) {
      newtraceNetworkEdge = {
        ...newtraceNetworkEdge,
        D_x: this.props.graphInitializationList[this.props.nowGraphInitializationId].parameter,
      };
    } else if (rdf == 2) {
      newtraceNetworkEdge = {
        ...newtraceNetworkEdge,
        F_x: this.props.graphInitializationList[this.props.nowGraphInitializationId].parameter,
      };
    }

    traceNetworkEdge.push(newtraceNetworkEdge);

    this.setState({
      ...this.state,
      traceNetwork: {
        nodes: this.state.traceNetwork.nodes,
        edges: traceNetworkEdge,
      },
    });

  };

  onChangeNodeParameterChange = (key, value) => {
    var traceNetworkNode = this.state.traceNetwork.nodes.filter(node => node.id != this.state.selectNodeId);

    var newtraceNetworkNode = {
      ...this.state.traceNetwork.nodes.filter(node => node.id == this.state.selectNodeId)[0],
      [key]: value,
    };

    traceNetworkNode.push(newtraceNetworkNode);

    this.setState({
      ...this.state,
      traceNetwork: {
        nodes: traceNetworkNode,
        edges: this.state.traceNetwork.edges,
      },
    });
  };

  render() {

    console.log('neuron_model_state');
    console.log(this.state);
    console.log('neuron_model_props');
    console.log(this.props);

    console.log(this.props.graphInitializationList);

    var DIR = 'http://localhost:3030/static/neuronElement/';

    if (this.state.destroyNeed == true) {
      this.state.network.setData({ nodes: [], edges: [] });
      this.setState({
        ...this.state,
        destroyNeed: false,
      });
    }

    var graph = { nodes: [], edges: [] };
    if (this.props.neuronModelList[this.props.nowNeuronModelId] != undefined) {
      graph = this.props.nowNeuronModelGraph;
    }

    var selectedEdge = {};

    if (this.state.selectEdgeId == -1) {
      selectedEdge = {
        description: 'none',
      };
    } else {
      selectedEdge = this.state.traceNetwork.edges.filter(edge => edge.id == this.state.selectEdgeId)[0];
    }

    var selectedNode = {};

    if (this.state.selectNodeId == -1) {
      selectedNode = {
        description: 'none',
      };
    } else {
      selectedNode = this.state.traceNetwork.nodes.filter(node => node.id == this.state.selectNodeId)[0];
    }

    console.log(selectedNode);


    if (this.state.selectEdgeId != -1) {

      const functionPlot = require('function-plot');

      console.log('selectedEdge');
      console.log(selectedEdge);

      var R_x_parameterGraph = '';
      _.map(selectedEdge.R_x, (parameter, index) => {
        R_x_parameterGraph = R_x_parameterGraph + parameter.name + '*' + String(parameter.value);
        if (index != Object.keys(selectedEdge.R_x).length - 1) R_x_parameterGraph = R_x_parameterGraph + '+';
      });

      var R_x_graphData = [{ fn: R_x_parameterGraph }];

      var functionGraphR = functionPlot({
        target: document.querySelector('#R_x'),
        width: window.innerWidth * 0.145,
        height: window.innerHeight * 0.27,
        disableZoom: true,
        yAxis: { domain: [-1, 1] },
        xAxis: { domain: [-1, 1] },
        tip: {
          renderer: function () {
          },
        },
        grid: true,
        data: R_x_graphData,
      });

      var D_x_parameterGraph = '';
      _.map(selectedEdge.D_x, (parameter, index) => {
        D_x_parameterGraph = D_x_parameterGraph + parameter.name + '*' + String(parameter.value);
        if (index != Object.keys(selectedEdge.D_x).length - 1) D_x_parameterGraph = D_x_parameterGraph + '+';
      });

      var D_x_graphData = [{ fn: D_x_parameterGraph }];

      var functionGraphD = functionPlot({
        target: document.querySelector('#D_x'),
        width: window.innerWidth * 0.145,
        height: window.innerHeight * 0.27,
        disableZoom: true,
        yAxis: { domain: [-1, 1] },
        xAxis: { domain: [-1, 1] },
        tip: {
          renderer: function () {
          },
        },
        grid: true,
        data: D_x_graphData,
      });

      var F_x_parameterGraph = '';
      _.map(selectedEdge.F_x, (parameter, index) => {
        F_x_parameterGraph = F_x_parameterGraph + parameter.name + '*' + String(parameter.value);
        if (index != Object.keys(selectedEdge.F_x).length - 1) F_x_parameterGraph = F_x_parameterGraph + '+';
      });

      var F_x_graphData = [{ fn: F_x_parameterGraph }];


      var functionGraphF = functionPlot({
        target: document.querySelector('#F_x'),
        width: window.innerWidth * 0.145,
        height: window.innerHeight * 0.27,
        disableZoom: true,
        yAxis: { domain: [-1, 1] },
        xAxis: { domain: [-1, 1] },
        tip: {
          renderer: function () {
          },
        },
        grid: true,
        data: F_x_graphData,
      });

      if (this.props.graphInitializationList[this.props.nowGraphInitializationId] != undefined) {
        var selectedGraph = this.props.graphInitializationList[this.props.nowGraphInitializationId].parameter;

        var S_x_parameterGraph = '';
        _.map(selectedGraph, (parameter, index) => {
          S_x_parameterGraph = S_x_parameterGraph + parameter.name + '*' + String(parameter.value);
          if (index != Object.keys(selectedGraph).length - 1) S_x_parameterGraph = S_x_parameterGraph + '+';
        });

        var S_x_graphData = [{ fn: S_x_parameterGraph }];

        console.log('S_x_graphData');
        console.log(S_x_graphData);

        var functionGraphS = functionPlot({
          target: document.querySelector('#S_x'),
          width: window.innerWidth * 0.15,
          height: window.innerHeight * 0.275,
          disableZoom: true,
          yAxis: { domain: [-1, 1] },
          xAxis: { domain: [-1, 1] },
          tip: {
            renderer: function () {
            },
          },
          grid: true,
          data: S_x_graphData,
        });
      }
    }

    if (this.state.reRenderNeed == true) {
      this.setState({
        ...this.state,
        reRenderNeed: false,
      });

    }

    return (
      <div>
        <Row style={{ 'margin': '0px' }}>
          <Col xs={1} sm={1} md={2} style={{ 'padding': '0px' }}>
            <ButtonGroup>
              <Button
                style={{ 'width': '5vw', 'backgroundColor': '#f27f87' }}
                className="text-white"
                outline
                onClick={() => {
                  var modelName = prompt('Model Name :');
                  this.props.modelAdd({ modelName: modelName }).then(() => this.props.modelFetch());
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
                style={{ 'width': '5vw', 'backgroundColor': '#37B940' }}
                className="text-white"
                outline
                onClick={() => {
                  var modelName = prompt('Model Name :');
                  this.props.modelSaveAs({
                    modelName: modelName,
                    nodes: this.state.traceNetwork.nodes,
                    edges: this.state.traceNetwork.edges,
                  }).then(() => this.props.modelFetch());
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
                style={{ 'width': '5vw', 'backgroundColor': '#30BDB4' }}
                className="text-white"
                outline
                onClick={() => {
                  console.log(this.state.network);
                  this.props.modelExport({
                    modelInfo: this.props.neuronModelList[this.props.nowNeuronModelId],
                    nodes: this.state.traceNetwork.nodes,
                    edges: this.state.traceNetwork.edges,
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
            <ListGroup style={{ width: '15vw' }}>
              {
                _.map(this.props.neuronModelList, (modelInfo, index) => (
                  <Row>
                    <UncontrolledButtonDropdown style={{ width: '2.5vw' }}>
                      <DropdownToggle color="secondary" outline caret>
                        <i className="fa fa-gear"/>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          data-id={index}
                          onClick={() => this.props.modelDelete(modelInfo).then(
                            () => this.props.modelFetch(),
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
                          style={{ 'backgroundColor': '#16E7E5', margin: '2px', width: '13vw' }}
                          tag="button"
                          onClick={() => {
                            this.props.modelImport(modelInfo).then(() => this.props.setNowNeuronModelId(modelInfo.id));
                          }}
                          action href="#">
                    <span className="ml-1 text-inverse"
                          ref={(el) => {
                            if (el) {
                              el.style.setProperty('color', '#000000', 'important');
                            }
                          }}>
                      {modelInfo.name}</span>
                        </ListGroupItem>) : (
                        <ListGroupItem
                          key={index}
                          style={{ 'backgroundColor': '#354D4D', margin: '2px', width: '13vw' }}
                          tag="button"
                          onClick={() => {
                            this.props.modelImport(modelInfo).then(() => this.props.setNowNeuronModelId(modelInfo.id));
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
            <div className={styles.cardBody} id="graph" style={{ height: '82vh', width: '47vw' }}>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.19.1/vis-network.min.css"/>
              <Graph
                getNetwork={this.setNetworkInstance}
                graph={graph}
                options={this.state.options}
                events={this.state.events}
              />
            </div>
            <Row>
              <div style={{ height: '1vh' }}>
              </div>
            </Row>
            {
              this.state.selectingEdge == true ? (
                  <div>
                    <h5 style={{ width: '10vw' }}><i className="fa fa-book"/> Description </h5>
                    <Input
                      style={{ width: '47vw' }}
                      placeholder=""
                      value={selectedEdge.description}
                      onChange={(e) => this.onClickEdgeParameterChange('description',e.target.value)}
                    >
                    </Input>
                  </div>)
                : this.state.selectingNode == true ? (
                  <div>
                    <h5 style={{ width: '10vw' }}><i className="fa fa-book"/> Description </h5>
                    <Input
                      style={{ width: '47vw' }}
                      placeholder=""
                      value={selectedNode.description}
                      onChange={(e) => this.onChangeNodeParameterChange('description',e.target.value)}
                    >
                    </Input>
                  </div>)
                : (<div></div>)
            }
          </Col>
          {
            this.state.selectingEdge == true ? (
              <Col xs={5} sm={5} md={2}>
                <h5 style={{ width: '10vw' }}><i className="fa fa-line-chart"/>{' '}
                  <MathJax.Context input='ascii'><MathJax.Node inline>R(X): dy +=
                    R(x)*dx</MathJax.Node></MathJax.Context></h5>

                <div id="R_x" style={{ 'width': '14.5vw', 'height': '27vh', 'backgroundColor': '#cccccc' }}>
                </div>

                <Row>
                  <div style={{ height: '1vh' }}>
                  </div>
                </Row>
                <h5 style={{ width: '10vw' }}><i className="fa fa-line-chart"/>{' '}
                  <MathJax.Context input='ascii'><MathJax.Node inline>D(X): dy +=
                    D(x-y)</MathJax.Node></MathJax.Context></h5>

                <div id="D_x" style={{ 'width': '14.5vw', 'height': '27vh', 'backgroundColor': '#cccccc' }}>
                </div>

                <Row>
                  <div style={{ height: '1vh' }}>
                  </div>
                </Row>
                <h5 style={{ width: '10vw' }}><i className="fa fa-line-chart"/>{' '}
                  <MathJax.Context input='ascii'><MathJax.Node inline>F(X): dy += F(y)</MathJax.Node></MathJax.Context>
                </h5>

                <div id="F_x" style={{ 'width': '14.5vw', 'height': '27vh', 'backgroundColor': '#cccccc' }}>
                </div>


              </Col>
            ) : this.state.selectingNode == true ? (
              <Col xs={2} sm={2} md={2}>
                <Table>
                  <tr>
                    <td><h5>{'Name'}</h5></td>
                    <td colSpan="5">
                      <Input
                        style={{ width: '10vw' }}
                        placeholder=""
                        value={selectedNode.label}
                        onChange={(e) => this.onChangeNodeParameterChange('label', e.target.value)}
                      >
                      </Input>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Locality'}</h5></td>
                    <td>
                      <Toggle
                        checked={selectedNode.locality == 'Global'}
                        onChange={() => this.onChangeNodeParameterChange('locality', 'Global')}
                      /><h6>{'Global'}</h6>
                    </td>
                    <td>
                      <Toggle
                        checked={selectedNode.locality == 'Local'}
                        onChange={() => this.onChangeNodeParameterChange('locality', 'Local')}
                      /><h6>{'Local'}</h6>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Role'}</h5></td>
                    <td>
                      <Toggle
                        checked={selectedNode.role == '@Input'}
                        onChange={() => this.onChangeNodeParameterChange('role', '@Input')}
                      /><h6>{'Input'}</h6>
                    </td>
                    <td>
                      <Toggle
                        checked={selectedNode.role == '@Inner'}
                        onChange={() => this.onChangeNodeParameterChange('role', '@Inner')}
                      /><h6>{'Inner'}</h6>
                    </td></tr><tr><td/>
                    <td>
                      <Toggle
                        checked={selectedNode.role == '@Backprop'}
                        onChange={() => this.onChangeNodeParameterChange('role', '@Backprop')}
                      /><h6>{'Backprop'}</h6>
                    </td>
                    <td>
                      <Toggle
                        checked={selectedNode.role == '@Output'}
                        onChange={() => this.onChangeNodeParameterChange('role', '@Output')}
                      /><h6>{'Output'}</h6>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Visual'}</h5></td>
                    <td>
                      <Toggle
                        checked={selectedNode.image == DIR + 'Channel.png'}
                        onChange={() => this.onChangeNodeParameterChange('image', DIR + 'Channel.png')}
                      /><h6>{'Channel'}</h6>
                    </td>
                    <td>
                      <Toggle
                        checked={selectedNode.image == DIR + 'Ion.png'}
                        onChange={() => this.onChangeNodeParameterChange('image', DIR + 'Ion.png')}
                      /><h6>{'Ion'}</h6>
                    </td></tr><tr><td/>
                    <td>
                      <Toggle
                        checked={selectedNode.image == DIR + 'Protein.png'}
                        onChange={() => this.onChangeNodeParameterChange('image', DIR + 'Protein.png')}
                      /><h6>{'Protein'}</h6>
                    </td>
                    <td>
                      <Toggle
                        checked={selectedNode.image == DIR + 'Energe.png'}
                        onChange={() => this.onChangeNodeParameterChange('image', DIR + 'Energe.png')}
                      /><h6>{'Energe'}</h6>
                    </td></tr><tr><td/>
                    <td>
                      <Toggle
                        checked={selectedNode.image == DIR + 'Else.png'}
                        onChange={() => this.onChangeNodeParameterChange('image', DIR + 'Else.png')}
                      /><h6>{'Else'}</h6>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Initial'}</h5></td>
                    <td colSpan="5">
                      <Input
                        style={{ width: '5vw' }}
                        placeholder=""
                        value={selectedNode.initial}
                        onChange={(e) => this.onChangeNodeParameterChange('initial', e.target.value)}
                      >
                      </Input>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Bound'}</h5></td>
                    <td colSpan="5">
                      <Row style={{ 'margin': '0px' }}>
                        <Input
                          style={{ width: '3vw' }}
                          placeholder=""
                          value={selectedNode.bound_min}
                          onChange={(e) => this.onChangeNodeParameterChange('bound_min', e.target.value)}
                        >
                        </Input>
                        <h5>{'~'}</h5>
                        <Input
                          style={{ width: '3vw' }}
                          placeholder=""
                          value={selectedNode.bound_max}
                          onChange={(e) => this.onChangeNodeParameterChange('bound_max', e.target.value)}
                        >
                        </Input>
                      </Row>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Random'}</h5></td>
                    <td colSpan="5">
                      <Input
                        style={{ width: '5vw' }}
                        placeholder=""
                        value={selectedNode.Random}
                        onChange={(e) => this.onChangeNodeParameterChange('Random', e.target.value)}
                      >
                      </Input>
                    </td>
                  </tr>
                </Table>
              </Col>
            ) : (<div></div>)
          }
          {
            this.state.selectingNode == true ? (<Col xs={5} sm={5} md={2}>
                  <ListGroup style={{ width: '15vw' }}>
                    {
                      _.map(this.props.graphInitializationList, (graphInfo, index) => (
                        <div>
                          <Row>
                            {
                              graphInfo.id == this.props.nowGraphInitializationId ? (
                                <ListGroupItem
                                  key={index}
                                  style={{ 'backgroundColor': '#9f92ca', margin: '2px', width: '15vw' }}
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
                          <MathJax.Context input='ascii'><MathJax.Node
                            inline>{graphInfo.name}</MathJax.Node></MathJax.Context>
                        </span>
                                </ListGroupItem>) : (
                                <ListGroupItem
                                  key={index}
                                  style={{ 'backgroundColor': '#2f2b3c', margin: '2px', width: '15vw' }}
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
                          <MathJax.Context input='ascii'><MathJax.Node
                            inline>{graphInfo.name}</MathJax.Node></MathJax.Context>
                        </span>
                                </ListGroupItem>
                              )
                            }
                          </Row>
                          {
                            graphInfo.id == this.props.nowGraphInitializationId ? (
                              <div>
                                <Row>
                                  <div id="S_x"
                                       style={{ 'width': '15vw', 'height': '27vh', 'backgroundColor': '#cccccc' }}>
                                  </div>
                                </Row>
                                <Row>
                                  <ButtonGroup>
                                    <Button
                                      style={{ 'width': '5vw', 'backgroundColor': '#f27f87' }}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onClickEdgeParameterChange(0);
                                      }}
                                    ><i className="fa fa-line-chart"/>{' '}
                                      <MathJax.Context input='ascii'><MathJax.Node
                                        inline>R(X)</MathJax.Node></MathJax.Context>
                                    </Button>
                                    <Button
                                      style={{ 'width': '5vw', 'backgroundColor': '#37B940' }}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onClickEdgeParameterChange(1);
                                      }}
                                    ><i className="fa fa-line-chart"/>{' '}
                                      <MathJax.Context input='ascii'><MathJax.Node
                                        inline>D(X)</MathJax.Node></MathJax.Context>
                                    </Button>
                                    <Button
                                      style={{ 'width': '5vw', 'backgroundColor': '#30BDB4' }}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onClickEdgeParameterChange(2);
                                      }}
                                    ><i className="fa fa-line-chart"/>{' '}
                                      <MathJax.Context input='ascii'><MathJax.Node
                                        inline>F(X)</MathJax.Node></MathJax.Context>
                                    </Button>
                                  </ButtonGroup>
                                </Row>
                              </div>
                            ) : (<div/>)
                          }
                        </div>
                      ))
                    }
                  </ListGroup>
                </Col>)
            :(<div></div>)
          }
          {
            this.state.selectingEdge == true ? (
                <Col xs={5} sm={5} md={2}>
                  <ListGroup style={{ width: '15vw' }}>
                    {
                      _.map(this.props.graphInitializationList, (graphInfo, index) => (
                        <div>
                          <Row>
                            {
                              graphInfo.id == this.props.nowGraphInitializationId ? (
                                <ListGroupItem
                                  key={index}
                                  style={{ 'backgroundColor': '#9f92ca', margin: '2px', width: '15vw' }}
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
                          <MathJax.Context input='ascii'><MathJax.Node
                            inline>{graphInfo.name}</MathJax.Node></MathJax.Context>
                        </span>
                                </ListGroupItem>) : (
                                <ListGroupItem
                                  key={index}
                                  style={{ 'backgroundColor': '#2f2b3c', margin: '2px', width: '15vw' }}
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
                          <MathJax.Context input='ascii'><MathJax.Node
                            inline>{graphInfo.name}</MathJax.Node></MathJax.Context>
                        </span>
                                </ListGroupItem>
                              )
                            }
                          </Row>
                          {
                            graphInfo.id == this.props.nowGraphInitializationId ? (
                              <div>
                                <Row>
                                  <div id="S_x"
                                       style={{ 'width': '15vw', 'height': '27vh', 'backgroundColor': '#cccccc' }}>
                                  </div>
                                </Row>
                                <Row>
                                  <ButtonGroup>
                                    <Button
                                      style={{ 'width': '5vw', 'backgroundColor': '#f27f87' }}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onClickEdgeParameterChange(0);
                                      }}
                                    ><i className="fa fa-line-chart"/>{' '}
                                      <MathJax.Context input='ascii'><MathJax.Node
                                        inline>R(X)</MathJax.Node></MathJax.Context>
                                    </Button>
                                    <Button
                                      style={{ 'width': '5vw', 'backgroundColor': '#37B940' }}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onClickEdgeParameterChange(1);
                                      }}
                                    ><i className="fa fa-line-chart"/>{' '}
                                      <MathJax.Context input='ascii'><MathJax.Node
                                        inline>D(X)</MathJax.Node></MathJax.Context>
                                    </Button>
                                    <Button
                                      style={{ 'width': '5vw', 'backgroundColor': '#30BDB4' }}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onClickEdgeParameterChange(2);
                                      }}
                                    ><i className="fa fa-line-chart"/>{' '}
                                      <MathJax.Context input='ascii'><MathJax.Node
                                        inline>F(X)</MathJax.Node></MathJax.Context>
                                    </Button>
                                  </ButtonGroup>
                                </Row>
                              </div>
                            ) : (<div/>)
                          }
                        </div>
                      ))
                    }
                  </ListGroup>
                </Col>)
              : (<div></div>)
          }
        </Row>
      </div>
    );
  }
}

export default neuronModelMaker;
