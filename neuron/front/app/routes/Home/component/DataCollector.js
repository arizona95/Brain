// @flow

import { Col, Container, Input, Row, Button, CardBody } from 'components';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';


class DataCollector extends React.Component<Props> {
  constructor(props){
      super(props);
      this.state={
        initialText:'',
        initialVideo:'',
        adding:false,
        editLocate:0,
      }
    }

  render(){
    return(
      <CardBody>
        <Row>
          <div style = {{height:'9vh'}}>
          </div>
        </Row>
        <Row>
        <Button
          style={{'width':'15vw', 'height':'10vh', 'align':'center'}}
          color="secondary"
          className="text-white"
          outline
          active={this.props.modelIsTraining}
          onClick={this.props.view1Change}
        >
          {'모델 선택'}
        </Button>
        <h1><i className="fa fa-3x fa-long-arrow-right"></i></h1>
        <Button
          style={{'width':'15vw', 'height':'10vh', 'align':'center'}}
          color="secondary"
          className="text-white"
          outline
          active={this.props.modelIsTraining}
          onClick={this.props.view2Change}
        >
          {'도메인 변환'}
        </Button>
        <h1><i className="fa fa-3x fa-long-arrow-right"></i></h1>
        <Button
          style={{'width':'15vw', 'height':'10vh', 'align':'center'}}
          color="secondary"
          className="text-white"
          outline
          active={this.props.modelIsTraining}
          onClick={this.props.view3Change}
        >
          {'데이터 학습'}
        </Button>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={10} lg={10}/>
          <h1><i className="fa fa-3x fa-long-arrow-down"></i></h1>
        </Row>
        <Row>
        <Button
          style={{'width':'15vw', 'height':'10vh', 'align':'center'}}
          color="secondary"
          className="text-white"
          outline
          active={this.props.modelIsTraining}
          onClick={this.props.view6Change}
        >
          {'데이터 시각화'}
        </Button>
        <h1><i className="fa fa-3x fa-long-arrow-left"></i></h1>
        <Button
          style={{'width':'15vw', 'height':'10vh', 'align':'center'}}
          color="secondary"
          className="text-white"
          outline
          active={this.props.modelIsTraining}
          onClick={this.props.view5Change}
        >
          {'데이터 품질 평가'}
        </Button>
        <h1><i className="fa fa-3x fa-long-arrow-left"></i></h1>
        <Button
          style={{'width':'15vw', 'height':'10vh', 'align':'center'}}
          color="secondary"
          className="text-white"
          outline
          active={this.props.modelIsTraining}
          onClick={this.props.view4Change}
        >
          {'데이터 증진'}
        </Button>
        </Row>
      </CardBody>
    )
  }
}

export default DataCollector;
