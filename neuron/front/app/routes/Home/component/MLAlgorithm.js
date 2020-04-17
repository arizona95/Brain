// @flow

import '!style-loader!css-loader!rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { Card, Col, cardBody,  Row,
  Toggle, Table, Button, Progress, DropdownMenu, UncontrolledButtonDropdown,
  DropdownToggle, DropdownItem, InputGroup,
    InputGroupAddon,Container,
    Input ,Form, FormGroup,} from 'components';
import _ from 'lodash';
import React from 'react';
import styles from './commonStyle.scss';
import ReactTooltip from 'react-tooltip';
import socketio from 'socket.io-client';

import classes from './Sliders.scss';

const socket = socketio.connect('http://localhost:3030')

class CustomizedSlider extends React.Component {
    constructor() {
        super();

    }

    onSliderChange(value){
      this.props.onChangeGenerateModelParameter(this.props.id, value);
    }

    render() {
        return(
            <Slider value={this.props.value} onChange={this.onSliderChange.bind(this)} />
        )
    }
}

class MLAlgorithm extends React.Component<Props> {
  constructor(props){
      super(props);
      this.state={
        adding:false,
        editLocate:0,
        resultState: false,
        imageStep: 1,
        selectedFile: null,
        filename:"<- Input file",
      }
    }

  handleData(data) {
    //let result = JSON.parse(data);
    //this.setState({count: this.state.count + result.movement});
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

  componentDidMount (){
    socket.on('epoch_edit', (obj)=>{
      var imageStep = parseInt(Number(obj.epoch) / 7)+1;
      if(imageStep > 14) imageStep = 14;
      if(Number(obj.epoch) == 100)
      {
        this.setState({
          ...this.state,
          imageStep: imageStep,
          epoch: {
            ..._.filter(this.state.epoch, epoch=>epoch.MLtime != obj.MLtime),
          }
        })
      }
      else
      {
        this.setState({
          ...this.state,
          imageStep: imageStep,
          epoch: {
            ..._.filter(this.state.epoch, epoch=>epoch.MLtime != obj.MLtime),
            [obj.epochId]: {
              epochId:obj.epochId,
              model: obj.model,
              DataList: obj.DataList,
              MLtime: obj.MLtime,
              epoch: Number(obj.epoch),
            }
          }
        })
      }
    })
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

  onClickTrain = () => {
    this.setState({...this.state, resultState:true});
  }

  render(){
    const dataColor='#11b8aa';
    const modelFitData = _.filter(this.props.collectedData, collectedData => collectedData.modelId == this.props.selectedModel.id);
    console.log(modelFitData);
    return(
      <cardBody style={{'width':'60vw', 'height':'120vh', 'padding':'20px'}}>
        <Row>
          <div style = {{height:'3vh'}}>
          </div>
        </Row>
          <Row >
            <Col xs={12} sm={12} md={5}>
              <Card>
                <div className={styles.cardBody}>
                  <Table>
                    <thead>
                    <tr>
                      <th colSpan="4"><h5>Data List</h5></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      _.map(modelFitData, (collectedData, index) => (
                        <tr key={index}>
                          <td>
                            <span className="ml-1 text-inverse"
                                  ref={(el) => {
                                    if (el) {
                                      el.style.setProperty('color', dataColor, 'important');
                                    }
                                  }}>{this.timeConverter(collectedData.updated_at).D}</span>
                            <p className="text-inverse" style={{'margin':'0px'}}>{this.timeConverter(collectedData.updated_at).T}</p>
                          </td>
                          <td>
                            <span className="ml-2 text-inverse">{collectedData.name}</span>
                          </td>
                          <td>
                            <label className="d-flex align-items-middle mb-0">
                              <Toggle
                                defaultChecked={collectedData.include}
                                value={index}
                                onChange={()=>{this.props.onChangecollectedData(collectedData.id);}}/>
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
                                  onClick={()=>this.props.deleteCollectedData(collectedData.id)}
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
                                uploadType:'collected',
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
                      <th colSpan="4"><h5>Parameter</h5></th>
                    </tr>
                    </thead>
                      {
                        _.map(this.props.generateModelParameter,(generateModelParameter, index) => (
                          <tr>
                            <td style={{'width':'6vw'}} ><span className="ml-2 text-inverse">{generateModelParameter.name}</span></td>
                            <td>
                              <div className={ classes.rangeSliderWrap }>
                                <CustomizedSlider
                                  id = {generateModelParameter.id}
                                  value = {generateModelParameter.value}
                                  onChangeGenerateModelParameter = {this.props.onChangeGenerateModelParameter}/>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    <tbody>
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
              onClick={() => {this.props.trainAction(); socket.emit('mlStart', { my: 'start' }); this.onClickTrain()}}
            >
              {'모델 학습 시작'}
            </Button>
        </Row>
        <Row>
          <div style = {{height:'1vh'}}>
          </div>
        </Row>
        <Row>
          <Table>
            <tbody>
            {
              _.map(_.values(this.state.epoch).sort((le, re) => le.epochId - re.epochId), (epoch, idx) => (

                <tr key={idx}>
                  <td></td><td></td><td></td>
                  <td>
                    <span className="ml-2 text-inverse">{epoch.model}</span>
                  </td>
                  <td className="text-inverse">
                    {epoch.MLtime}
                  </td>
                  <td>
                    <Progress value={epoch.epoch} style={{ height: "2vh", width: '35vw' }} color="success"/>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </Table>

        </Row>
        {this.state.resultState ? 
        <Row>
          <Table>
              <thead>
                <tr>
                  <th colSpan="4"><h5>학습 과정 시각화</h5></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><img src={require('./Result/' + this.state.imageStep + '_i.png')} alt="Logo" style={{width:'45vh',height:'45vh'}}/></td>
                  <td><img src={require('./Result/' + this.state.imageStep + '_g.png')} alt="Logo" style={{width:'45vh',height:'45vh'}}/></td>
                </tr>
              </tbody>
            </Table>
        </Row> : null
      }

      </cardBody>
    )
  }
}

export default MLAlgorithm;
