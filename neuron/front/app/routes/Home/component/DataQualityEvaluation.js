// @flow

import {
  Button,
  cardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Table,
  Toggle,
  UncontrolledButtonDropdown,
  Card,
  InputGroup,
  InputGroupAddon,
  Input,
} from 'components';
import _ from 'lodash';
import React from 'react';
import styles from './commonStyle.scss';
import ReactTooltip from 'react-tooltip';

class DataQualityEvaluation extends React.Component<Props> {
  constructor(props){
      super(props);
      this.state={
        initialText:'',
        initialVideo:'',
        adding:false,
        editLocate:0,
        viewId:0,
        resultState: false,
        selectedFile: null,
        filename:"<- Input file",
      }
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

  onClickBenchmark = () => {
    console.log(this.state)
    this.setState({...this.state, resultState:true});
  }

  onChangeFileInput = (filename)=>{
    this.setState({
      ...this.state,
      selectedFile:filename.target.files[0],
      filename:filename.target.files[0].name,
      }
    );
  }

  onChangeTextInput = (textInput)=>{
    this.setState({
      ...this.state,
      filename:textInput.target.value,
      }
    );
  }

  render(){
    const dataColor='#11b8aa';
    const modelfitGD = _.filter(this.props.generateData,
      generateData => generateData.modelId == this.props.selectedModel.id);
    return(
      <cardBody>
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
                    <th colSpan="4 "><h5>DataList</h5></th>
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
                          <span className="ml-2 text-inverse">{data.name}</span>
                        </td>
                        <td>
                          <label className="d-flex align-items-middle mb-0">
                            <Toggle
                              defaultChecked={data.include}
                              value={index}
                              onChange={()=>{this.props.onChangeGeneratedData(data.id);}}/>
                          </label>
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
                  <tr>
                      <td colSpan="4">
                      <InputGroup style={{'width':'21vw'}}>
                        <InputGroupAddon addonType="prepend">
                          <Button
                            color="secondary"
                            style={{'width':'2vw'}}>
                            <i className="fa fa fa-fw fa-paperclip"
                            style={{'width':'1vw'}}></i>
                            <input
                              type="file"
                              name="myfile"
                              style={{'width':'2vw'}}
                              onChange={this.onChangeFileInput}
                            />
                          </Button>
                          <Input
                            placeholder=""
                            value = {this.state.filename}
                            style={{'width':'17vw'}}
                            onChange ={this.onChangeTextInput}/>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                          <Button
                            color="primary"
                            onClick={() => {
                              this.props.uploadAction({
                                selectedFile: this.state.selectedFile,
                                filename: this.state.filename,
                                uploadType:'benchmark',
                              })

                              this.setState({
                                selectedFile: null,
                                filename:"<- Input file",
                              })
                            }}
                          >
                            <i className="fa fa-fw fa-send"></i>
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                      </td>
                    </tr>
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
                    _.map(this.props.benchmarkAlgorithm, (algo, index) => (
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
                              onChange={()=>{this.props.onChangeBenchamrkAlgorithmData(algo.id);}}/>
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
            onClick={() =>{
              this.onClickBenchmark();
              this.props.evaluateAction();
            }}
          >
            {'데이터 벤치마크 수행'}
          </Button>
      </Row>
      <Row>
        <div style = {{height:'5vh'}}>
        </div>
      </Row>
      {this.state.resultState ? 
        <Row>
        <Col xs={12} sm={12} md={1} style={{'padding':'0px', 'margin':'0px'}}>
          {
            _.map(this.props.benchmarkResult.benchmark , (bcm, index) => {
              return(
                <Row>
                  <Button
                  style={{'width':'4vw', 'align':'center', 'margin':'10px'}}
                  color="secondary"
                  className="text-white"
                  outline
                  active={bcm.id == this.state.viewId}
                  onClick={() =>{
                    this.props.fetchBenchmarkData()
                      .then(()=>{
                        this.setState({...this.state, viewId:bcm.id})
                      })}}
                  ><a className="ml-1 text-inverse" data-tip data-for={index+10000}
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty('color', dataColor, 'important');
                      }
                    }}>{this.timeConverter(bcm.updated_at).D}</a>
                    <ReactTooltip id={index+10000} aria-haspopup='true' role='example'>
                    { bcm.info.p.map(p=>(<p>{p}</p>)) }
                    <ul> {bcm.info.li.map(li=>(<li>{li}</li>)) } </ul>
                    </ReactTooltip>

                    <p style={{'margin':'0px'}}>{this.timeConverter(bcm.updated_at).T}</p>

                  </Button>
                </Row>
              )
            })
          }
          </Col>
          <Col xs={12} sm={12} md={11}>
            <Table>
              <thead>
                <tr>
                  <th colSpan="4"><h5>Benchamrk Result</h5></th>
                </tr>
              </thead>
              <tbody>

                    { Object.keys(this.props.benchmarkResult.benchmark).length === 0 ? (<tr/>):(

                      <tr><td></td>
                      {
                        _.map(this.props.benchmarkResult.benchmark[this.state.viewId].data[0].result,(br, index) => {
                          return (
                            <td key={index}><span className="ml-2 text-inverse">{this.props.benchmarkAlgorithm[br.algoId].name}</span></td>
                          )
                        })
                      }
                      </tr>)

                    }
                    {
                      Object.keys(this.props.benchmarkResult.benchmark).length === 0 ? (<tr/>):(
                      _.map(this.props.benchmarkResult.benchmark[this.state.viewId].data ,(data, index) => {
                      console.log(this.props.generateData);
                      console.log(data)
                        return (
                          <tr><td><span className="ml-2 text-inverse">{this.props.generateData[data.dataId].name}</span></td>
                            {
                              _.map(data.result,da=>{
                              return(<td key={da.id}><span className="ml-2 text-inverse">{da.value}</span></td>)
                              })
                            }
                          </tr>
                        )
                      }))
                    }
              </tbody>
            </Table>
          </Col>
        </Row> : null
      }

    </cardBody>
    )
  }
}

export default DataQualityEvaluation;
