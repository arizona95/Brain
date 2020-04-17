import React from 'react';
import PropTypes from 'prop-types';
import MatchMedia from 'react-responsive';

import { withPageConfig } from './../../components/Layout/withPageConfig';

const SlimProps = (props) => {
    const {
        children,
    } = props;

    return (
        <React.Fragment>
            <MatchMedia maxWidth={ 991.8 }>
                { children }
            </MatchMedia>
        </React.Fragment>
    );
};
SlimProps.propTypes = {
    children: PropTypes.node,
    pageConfig: PropTypes.object,
    slimProps: PropTypes.object,
    defaultProps: PropTypes.object
};

const ExtendedSlimProps = withPageConfig(SlimProps);

export {
    ExtendedSlimProps as SlimProps
}
