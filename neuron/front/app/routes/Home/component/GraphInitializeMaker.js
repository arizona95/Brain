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
  DropdownMenu,
  Table,} from 'components';

import styles from './commonStyle.scss';
import classes from './Sliders.scss';
import _ from 'lodash';
import React from 'react';

import MathJax from 'react-mathjax2'
import d3 from "d3";
window.d3 = d3;
const functionPlot = require("function-plot");

class GraphInitializeMaker extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      parameter:{
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
          "value":1.00000,
          "lock":false,
        },
        5:{
          "id": 5,
          "name":"x^0",
          "value":0.00000,
          "lock":true,
        },
      },
      wantToMakeGraph:"x",
      drawGraph:"",
      parameterMaxABS:10.0,
      fetched:0,

    };

  }


  componentDidMount() {
    this.props.graphFetch();
  }

  componentWillReceiveProps(nextProps) {

    console.log(123)
    if (nextProps.graphInitializationList[nextProps.nowGraphInitializationId] != undefined ) {
      if(this.props.nowGraphInitializationId !=nextProps.nowGraphInitializationId) {
        this.setState({
          ...this.state,
          parameter: nextProps.graphInitializationList[nextProps.nowGraphInitializationId].parameter,
        })
      }
    }
  }



  onChangeParameter = (id, value)=> {
    this.setState({
      ...this.state,
      parameter:{
        ...this.state.parameter,
        [id]:{
          ...this.state.parameter[id],
          value: (value-50)*this.state.parameterMaxABS/50,
        }
      }
    })
  }

  onChangeParameterByValue = (id, value)=>{
    this.setState({
      ...this.state,
      parameter:{
        ...this.state.parameter,
        [id]:{
          ...this.state.parameter[id],
          value: value,
        }
      }
    })
  }

  onChangeMaxAbs = (value)=> {
    this.setState({
      ...this.state,
      parameterMaxABS:value/10,
    })
  }

  onChangeParameterLock = (id)=> {
    this.setState({
      ...this.state,
      parameter: {
        ...this.state.parameter,
        [id]: {
          ...this.state.parameter[id],
          lock: this.state.parameter[id].lock == true ? false : true,
        }
      }
    })
  }

  onChangeWantToMakeGraph = (value) => {
    this.setState({
      ...this.state,
      wantToMakeGraph:value,
    })
  }

  onClickDrawGraph=() =>{
    console.log("123")
    this.setState({
      ...this.state,
      drawGraph:this.state.wantToMakeGraph,
    })
  }


  render() {

    console.log('graph_state')
    console.log(this.state)
    console.log('graph_props')
    console.log(this.props)

    const root = document.querySelector("#functionPlot");
    var parameterGraph = ""
    _.map(this.state.parameter, (parameter, index)=>{
      parameterGraph=parameterGraph + parameter.name+"*"+String(parameter.value)
      if(index!= Object.keys(this.state.parameter).length-1) parameterGraph=parameterGraph +"+"
    } )

    var graphData =[{fn: parameterGraph,}]

    if(this.state.drawGraph !="") graphData.push({fn: this.state.drawGraph,})

    var functionGraph = functionPlot({
        target: root,
        width: window.innerWidth*0.40,
        height: window.innerHeight*0.80,
        title: "    y=f(x)",
        disableZoom:true,
        yAxis: { domain: [-1, 1] },
        xAxis: { domain: [-1, 1] },
        tip: {
          renderer: function() {}
        },
        grid: true,
        data: graphData
      });

    const marksParameter = {
      0:'-'+String(this.state.parameterMaxABS),
      50: '0',
      100:'+'+String(this.state.parameterMaxABS),
    }

    const marksMaxAbs = {
      0: '0',
      10:'1',
      50:'5',
      100:'10',
    }

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
          "value":1.00000,
          "lock":false,
        },
        5:{
          "id": 5,
          "name":"x^0",
          "value":0.00000,
          "lock":true,
        },
      }


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
                var graphName = prompt('Graph Name :');
                this.props.graphAdd({
                  graphName: graphName,
                  graphData:initialParameter,
                }).then(()=>this.props.graphFetch());
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
                var graphName = prompt('Graph Name :');
                this.props.graphSaveAs({
                  graphName: graphName,
                  graphData: this.state.parameter,
                }).then(()=>this.props.graphFetch());
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
                this.props.graphExport({
                  graphId: this.props.graphInitializationList[this.props.nowGraphInitializationId].id,
                  graphData: this.state.parameter,
                }).then(()=>this.props.graphFetch())
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
              _.map(this.props.graphInitializationList, (graphInfo, index) => (
                <Row>
                  <UncontrolledButtonDropdown style = {{ width :"2.5vw"}}>
                      <DropdownToggle color="secondary" outline caret>
                        <i className="fa fa-gear"/>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          data-id={index}
                          onClick={()=>this.props.graphDelete(graphInfo).then(
                            ()=>this.props.graphFetch()
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
                    graphInfo.id == this.props.nowGraphInitializationId ? (
                    <ListGroupItem
                      key={index}
                      style={{ "backgroundColor": "#9f92ca", margin: "2px", width: "13vw" }}
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
                      style={{ "backgroundColor": "#2f2b3c", margin: "2px", width: "13vw" }}
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
        <Col xs={5} sm={5} md={6}>

          <div id="functionPlot" style={{"width":"42vw", "height":"82vh", "backgroundColor":"#cccccc", "paddingLeft":"1vw"}}>
          </div>
        </Col>
          <Col xs={5} sm={5} md={4}>
            <Row>
            <div className={styles.cardBody1}>
                    <Table>
                      <thead>
                      <tr>
                        <th colSpan="4">
                          <Row>
                          <h5 style={{width:'10vw', "paddingLeft":'3vw'}}>Parameter</h5>
                          <Slider
                                    style={{width:'15vw'}}
                                    id = "0"
                                    value = {this.state.parameterMaxABS*10}
                                    marks = {marksMaxAbs}
                                    step = {10}
                                    onChange= {(value)=>{this.onChangeMaxAbs(value)}}/></Row>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                        {
                          _.map(this.state.parameter,(parameter, index) => (
                            <tr>
                              {
                                parameter.lock == false ?(
                                  <td style={{'width':'1vw'}}>
                                    <Button
                                      style={{'width':'2vw', "backgroundColor": "#121212"}}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onChangeParameterLock(parameter.id)
                                      }}
                                    ><i className="fa fa-unlock"/>
                                    </Button>
                                  </td>
                                ):(
                                  <td style={{'width':'1vw'}}>
                                    <Button
                                      style={{'width':'2vw', "backgroundColor": "#333333"}}
                                      className="text-white"
                                      outline
                                      onClick={() => {
                                        this.onChangeParameterLock(parameter.id)
                                      }}
                                    ><i className="fa fa-lock"/>
                                    </Button>
                                  </td>
                                )
                              }
                              <td style={{'width':'2vw'}} ><span className="ml-2 text-inverse">
                                <MathJax.Context input='ascii'><MathJax.Node inline>{parameter.name}</MathJax.Node></MathJax.Context>
                              </span></td>
                              <td>

                                  <Slider
                                    id = {index}
                                    value = {(parameter.value)*50/this.state.parameterMaxABS +50 }
                                    marks = {marksParameter}
                                    included={false}
                                    onChange= {(value)=>{this.onChangeParameter(parameter.id, value)}}/>
                              </td>
                              <td style={{'width':'6vw'}} >
                                <Input
                                  placeholder=""
                                  value={parameter.value }
                                  onChange = {(e)=>this.onChangeParameterByValue(parameter.id, e.target.value)}
                                >
                                </Input>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  </div>
            </Row>
            <Row>
              <div style = {{height:'5vh'}}>
              </div>
            </Row>
            <Row>
              <h5 style={{width:'7vw'}}>Graph to draw :</h5>
              <Input
                style={{width:'17vw'}}
                placeholder="..Enter graph"
                value={this.state.wantToMakeGraph}
                onChange = {(e)=>this.onChangeWantToMakeGraph(e.target.value)}
              >
              </Input>
              <Button
              style={{'width':'3vw', "backgroundColor": "#FF4040"}}
              className="text-white"
              outline
              onClick={() => {this.onClickDrawGraph()}}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('color', '#ffffff', 'important');
                        }
                      }}>
                  <i className="fa fa-line-chart"/></span>
            </Button>
            </Row>

          </Col>
        </Row>
      </div>
    );
  }
}

export default GraphInitializeMaker;
