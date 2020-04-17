import React from 'react';
import PropTypes from 'prop-types';

import { withPageConfig } from './../Layout/withPageConfig';

const DefaultOnly = (props) => (
    <React.Fragment>{ props.children }</React.Fragment>
);
DefaultOnly.propTypes = {
    children: PropTypes.node.isRequired,
    pageConfig: PropTypes.object
};

const ExtendedDefaultOnly = withPageConfig(DefaultOnly);

export {
    ExtendedDefaultOnly as DefaultOnly
};
