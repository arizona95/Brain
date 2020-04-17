// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import { 
    InputGroup,
    InputGroupAddon,
    Button,
    Input
} from './../';


type Props={
   problemId: number,
    addDebate: (
    userId: number,
    problemId: number,
    chat: string ,
  )=>void,
}

type State={
    chat: string,
}

class ChatCardFooter extends React.Component<Props, State>{

  constructor(props) {
    super(props);
    this.state = {
        chat: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      chat: e.target.value
    })
  }

  render() {
    return(
      <React.Fragment>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <Button color="secondary">
                <i className="fa fa fa-fw fa-paperclip"></i>
            </Button>
          </InputGroupAddon>
          <Input
            onFocus={()=>{this.props.setFocus(true);}}
            placeholder="Your message..."
            value={this.state.chat}
            onChange ={this.handleChange}/>
          <InputGroupAddon addonType="append">
            <Button
              color="primary"
              onClick={() => {
                this.props.addDebate(1, this.props.problemId, this.state.chat);
                this.setState({chat:''});
                this.props.setFocus(false);
              }}
            >
              <i className="fa fa-fw fa-send"></i>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </React.Fragment>
    )
  }
}

export default ChatCardFooter ;
