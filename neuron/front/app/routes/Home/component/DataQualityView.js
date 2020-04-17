// @flow

import colors from 'colors';
import {
  Button,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Table,
  Toggle,
  UncontrolledButtonDropdown,
  Card
} from 'components';
import gamImage from 'components/logo/gan1.png';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'components/Recharts';
import _ from 'lodash';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './commonStyle.scss';

const radian = Math.PI / 180;

class DataQualityView extends React.Component<Props> {
  constructor(props){
      super(props);
     this.state = {
        numRows: 25,
        beta: 22,
        viewId:0,
      };
    }

  timeConverter = (UNIX_timestamp) => {
    const date = new Date(UNIX_timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const genDate= year+'/'+month+'/'+day;
    const genTime=hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return {D:genDate,T:genTime}
  }

  componentWillMount () {
      const { numRows } = this.state;

      const data = [];
      const d = 360 / numRows;
      const step = d * radian;

      for (let i = 0; i < numRows; i++) {
        const iCos = Math.cos(i * step);
        for (let j = 0; j < numRows; j++) {
          const value = iCos * Math.cos(j * step);
          data.push([i, value, j]);
        }
      }
     this.setState({
      data
    });
  }

  makeAUCData = ( AUCData )=> {
    let graphData=[]
    AUCData.x.map((x, index)=>{
      let pushData={}
      pushData['name'] = String(x)
      _.map(AUCData.result , result =>
        pushData[this.props.IDSAlgorithm[result.algoId].name] = parseInt(result.y[index]*100)
      )
      graphData.push(pushData)

    })

    let algoName = []
    _.map(AUCData.result , result =>algoName.push(this.props.IDSAlgorithm[result.algoId].name))
    return {g:graphData, a : algoName}
  }


  render(){
    const dataColor='#11b8aa';

    const modelfitGD = _.filter(this.props.generateData,
      generateData => generateData.modelId == this.props.selectedModel.id);

    const graphColor=[
      'purple', 'primary', 'info'
    ];

    const graphFillColor=[
      'purple-04', 'primary-04', 'info-04'
    ];
    var evalData = [];
    _.map(this.props.evaluateResult, evaluateResult => (evalData.push(evaluateResult)));

    var temp={};

    if(Object.keys(this.props.IDSalgorithmResult.AUC).length !=0) {
      temp = this.makeAUCData(this.props.IDSalgorithmResult.AUC[this.state.viewId])
    }
    else{
      temp = {}
    }

    const dataa = temp.g
    const algoName = temp.a
    const { numRows, data, beta } = this.state;
    if (!data) return null;

    return(
      <CardBody>
        <Row>
        <div style = {{height:'3vh'}}>
        </div>
      </Row>
        <Row >
          <Col xs={12} sm={12} md={5}>
            <Card>
              <div className={styles.cardBody}>
                <Table >
                  <thead>
                  <tr>
                    <th colSpan="3 "><h5>DataList</h5></th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    _.map(modelfitGD, (data, index) => (
                      <tr key={index}>
                        <td>
                          <span className="ml-1 text-inverse"
                                ref={(el) => {
                                  if (el) {
                                    el.style.setProperty('color', dataColor, 'important');
                                  }
                                }}>{this.timeConverter(data.updated_at).D}</span>
                          <p style={{'margin':'0px'}}>{this.timeConverter(data.updated_at).T}</p>
                        </td>
                        <td>
                          <Button
                            style={{'width':'15vh'}}
                            color="secondary"
                            className="text-white"
                            outline
                            active={data.id === this.props.selectedGenerateData.id}
                            onClick={() => {this.props.onSelectGenerateData(data.id)}}
                          >
                            {data.name}
                          </Button>
                        </td>
                        <td>
                          <UncontrolledButtonDropdown>
                            <DropdownToggle color="secondary" outline caret>
                              <i className="fa fa-gear"/>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem
                                data-id={index}
                                onClick={()=>this.props.deleteGeneratedData(data.id)}
                              >
                                <span className="text-danger">
                                  <i className="fa fa-fw fa-remove mr-2"/>
                                  데이터 삭제
                                </span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </td>
                      </tr>
                    ))
                  }
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={2}/>
          <Col xs={12} sm={12} md={5}>
            <Card>
              <div className={styles.cardBody}>
                <Table>
                  <thead>
                  <tr>
                    <th colSpan="3"><h5>AlgoList</h5></th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    _.map(this.props.IDSAlgorithm, (algo, index) => (
                      <tr key={index}>
                        <td></td>
                        <td>
                            <a className="ml-2 text-inverse" data-tip data-for={index}> {algo.name} </a>
                            <ReactTooltip id={index} aria-haspopup='true' role='example'>
                            { algo.info.p.map(p=>(<p>{p}</p>)) }
                            <ul> {algo.info.li.map(li=>(<li>{li}</li>)) } </ul>
                            </ReactTooltip>
                        </td>
                        <td>
                          <label className="d-flex align-items-middle mb-0">
                            <Toggle
                              defaultChecked={algo.include}
                              value={index}
                              onChange={()=>{this.props.onChangeIDSAlgorithmData(algo.id);}}/>
                          </label>
                        </td>
                      </tr>
                    ))
                  }
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      <Row>
        <div style = {{height:'5vh'}}>
        </div>
      </Row>

      <Row>
        <Col xs={12} sm={12} md={3}/>
          <Button
            style={{'width':'30vw', 'align':'center'}}
            color="secondary"
            className="text-white"
            outline
            active={this.props.modelIsTraining}
            onClick={() => this.props.viewAction()}
          >
            {'IDS algorithm test'}
          </Button>
      </Row>
      <Row>
        <div style = {{height:'5vh'}}>
        </div>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={1} style={{'padding':'0px', 'margin':'0px'}}>
        {
          Object.keys(temp).length === 0 ? (<tr/>):(
          _.map(this.props.IDSalgorithmResult.AUC , (auc, index) => {
            return(
              <Row>
                <Button
                style={{'width':'4vw', 'align':'center', 'margin':'10px'}}
                color="secondary"
                className="text-white"
                outline
                active={auc.id == this.state.viewId}
                onClick={() =>{
                  this.props.fetchIDSData()
                    .then(()=>{
                      this.setState({...this.state, viewId:auc.id})
                    })}}
                ><a className="ml-1 text-inverse" data-tip data-for={index+10000}
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('color', dataColor, 'important');
                    }
                  }}>{this.timeConverter(auc.updated_at).D}</a>
                  <ReactTooltip id={index+10000} aria-haspopup='true' role='example'>
                  { auc.info.p.map(p=>(<p>{p}</p>)) }
                  <ul> {auc.info.li.map(li=>(<li>{li}</li>)) } </ul>
                  </ReactTooltip>

                  <p style={{'margin':'0px'}}>{this.timeConverter(auc.updated_at).T}</p>

                </Button>
              </Row>
            )
          }))
        }
        </Col>
        <Col xs={12} sm={12} md={11}>
          <Table>
            <thead>
              <tr>
                <th colSpan="2"><h5>IDS Test Result</h5></th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <span className="ml-2 text-inverse">{'AUC'}</span>
              </td>
              <td className="text-inverse">
                <ResponsiveContainer width='100%' aspect={6.0/3.0}>
                  <LineChart data={dataa}
                      margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis dataKey="name"/>
                      <YAxis/>
                      <Tooltip/>
                      <Legend />
                      {
                        Object.keys(temp).length === 0 ? (<tr/>):(
                        algoName.map((an, index) => {

                          return(
                            <Line key = {index} dataKey={String(an)}  stroke={ colors[graphColor[index]] }  />
                          )
                        }))
                      }
                  </LineChart>
              </ResponsiveContainer>
              </td>
            </tr>
            <tr>
            <td>
             
            </td>
              <td>
                <Table>
                  <tbody>

                  {
                    Object.keys(temp).length === 0 ? (<tr/>):(
                    <tr><td></td>
                    {
                      algoName.map((an, index) => {
                        return (
                          <td key={index}><span className="ml-2 text-inverse">{an}</span></td>
                        )
                      })
                    }
                    </tr>)

                  }
                  {
                    Object.keys(temp).length === 0 ? (<tr/>):(
                    <tr><td><span className="ml-2 text-inverse">{'AUC area'}</span></td>
                    {
                      _.map(this.props.IDSalgorithmResult.AUC[this.state.viewId].result ,(result, index) => {
                        return (
                          <td key={index}><span className="ml-2 text-inverse">{result.aucArea}</span></td>
                        )
                      })
                    }
                    </tr>)

                  }
                  {
                    Object.keys(temp).length === 0 ? (<tr/>):(
                    <tr><td><span className="ml-2 text-inverse">{'ERR'}</span></td>
                    {
                      _.map(this.props.IDSalgorithmResult.AUC[this.state.viewId].result ,(result, index) => {
                        return (
                          <td key={index}><span className="ml-2 text-inverse">{result.ERR}</span></td>
                        )
                      })
                    }
                    </tr>)

                  }
                  </tbody>
                </Table>
              </td>
            </tr>
            <tr>
            <td>
              <span className="ml-2 text-inverse">{'diagram'}</span>
            </td>
              <td>
                <ResponsiveContainer width='100%' aspect={ 2.2 }>
                  <RadarChart outerRadius={150} data={evalData}>
                    <PolarGrid stroke="green" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={0} domain={[0, 100]}/>
                    <Radar name="점수" dataKey="A" stroke={ colors['purple'] } fill={ colors['purple'] } fillOpacity={0.3}/>
                    <Radar name="커트라인" dataKey="B" stroke={ colors['primary'] } fill={ colors['primary'] } fillOpacity={0.3}/>
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </td>
            </tr>

            </tbody>
          </Table>
        </Col>
        </Row>
      </CardBody>
    )
  }
}

export default DataQualityView;
