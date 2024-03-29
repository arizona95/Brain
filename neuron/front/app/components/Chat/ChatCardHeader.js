import React from 'react';

import { 
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from './../';

const ChatCardHeader = () => (
    <React.Fragment>
    <h6 className="align-self-center mb-0">
        Chat with Romaine Weber
    </h6>
    <UncontrolledButtonDropdown className="align-self-center ml-auto">
    <DropdownToggle color="secondary" outline caret size="sm">
        <i className="fa fa-gear"></i>
    </DropdownToggle>
    <DropdownMenu right>
        <DropdownItem>
            <i className="fa fa-fw fa-comment mr-2"></i>
            Private Message
        </DropdownItem>
        <DropdownItem>
            <i className="fa fa-fw fa-search mr-2"></i>
            Search this Thread
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem>
            <i className="fa fa-fw fa-ban mr-2"></i>
            Block this User
        </DropdownItem>
    </DropdownMenu>
    </UncontrolledButtonDropdown>
    </React.Fragment>
)

export { ChatCardHeader };
