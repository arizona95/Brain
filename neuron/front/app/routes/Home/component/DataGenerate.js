// @flow

import { Card, Col, Input, Row,  Table, CardBody, Button, DropdownMenu, UncontrolledButtonDropdown,  DropdownToggle, DropdownItem, } from 'components';
import _ from 'lodash';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './commonStyle.scss';

class DataGenerate extends React.Component<Props> {
  constructor(props){
      super(props);
      this.state={
        initialText:'',
        initialVideo:'',
        adding:false,
        editLocate:0,
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

  render(){
    const dataColor='#11b8aa';
    const modelfitGM = _.filter(this.props.generateModel,
        generateModel=> generateModel.modelId == this.props.selectedModel.id);
    return(
      <CardBody>
        <Row>
          <div style = {{height:'3vh'}}>
          </div>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={3}/>
          <Col xs={12} sm={12} md={8}>
            <Card>
              <div className={styles.cardBody1}>
                <Table>
                  <thead>
                  <tr>
                    <th colSpan ="3"><h5>Trained Model</h5></th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    _.map(modelfitGM, (model, index) => (
                      <tr key={index}>
                        <td>
                          <span className="ml-1 text-inverse"
                                ref={(el) => {
                                  if (el) {
                                    el.style.setProperty('color', dataColor, 'important');
                                  }
                                }}>{this.timeConverter(model.updated_at).D}</span>
                          <p style={{'margin':'0px'}}>{this.timeConverter(model.updated_at).T}</p>
                        </td>
                        <td>
                          <Button
                            style={{'width':'12vw'}}
                            color="secondary"
                            className="text-white"
                            outline
                            active={model.id === this.props.selectedGenerateModel.id}
                            onClick={() => {this.props.onSelectGenerateModel(model.id)}}
                          >
                            <a data-tip data-for={String(index)}> {model.name} </a>
                            <ReactTooltip id={String(index)} aria-haspopup='true' role='example'>
                              {model.description}
                              </ReactTooltip>
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
                                onClick={()=>this.props.deleteGenerateModel(model.id)}
                              >
                                <span className="text-danger">
                                  <i className="fa fa-fw fa-remove mr-2"/>
                                  모델 삭제
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
        </Row>
        <Row>
          <div style = {{height:'3vh'}}>
          </div>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={3}/>
          <Col xs={12} sm={12} md={2}>
          <h5>{'생성할 데이터 양 :'}</h5>
          </Col>
          <Col xs={12} sm={12} md={4}>
          <Input
              placeholder="generae amount..."
              value={this.state.video_comment}
              onChange ={this.props.onChangeGenerateAmount}/>
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
            onClick={() => this.props.generateAction()}
          >
            {'데이터 생성'}
          </Button>
      </Row>
      </CardBody>
    )
  }
}

export default DataGenerate;
