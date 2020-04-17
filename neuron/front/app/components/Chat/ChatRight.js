import React from 'react';
import PropTypes from 'prop-types';

import faker from 'faker';

import { 
    Card,
    Media,
    Avatar,
    AvatarAddOn
} from './../';

import { randomArray, randomAvatar } from './../../utilities';

const status = [
    "warning",
    "danger",
    "success",
    "secondary"
];

type Props = {
    chat: string,
    date: string,
}
const ChatRight = (props: Props) => (
    <React.Fragment>
        <Media className="mb-2">
            <Media body>
                <Card body className={ `mb-2 ${ props.cardClassName }` }>
                    <p className="mb-0">
                        { props.chat }
                    </p>                                                   
                </Card>
                <div className="mb-2 text-right">
                    <span className="text-inverse mr-2">
                        { faker.name.firstName() } { faker.name.firstName() }
                    </span>
                    <span className="small">
                        { props.date }
                    </span>
                </div>
            </Media>
            <Media right className="ml-3">
                <Avatar.Image
                    size="md"
                    src={ randomAvatar() }
                    className="mr-2"
                    addOns={[
                        <AvatarAddOn.Icon 
                            className="fa fa-circle"
                            color="black"
                            key="avatar-icon-bg"
                        />,
                        <AvatarAddOn.Icon 
                            className="fa fa-circle"
                            color={ randomArray(status) }
                            key="avatar-icon-fg"
                        />
                    ]}
                />
            </Media>
        </Media>
    </React.Fragment>
)
ChatRight.propTypes = {
    cardClassName: PropTypes.node
};
ChatRight.defaultProps = {
    cardClassName: "bg-gray-600"
};

export { ChatRight };
