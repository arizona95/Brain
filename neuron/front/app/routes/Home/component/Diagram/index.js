import * as React from 'react';

import { BodyWidget } from './widgets';
import Application from './Application';

const Diagram = () => {
	const app = new Application();
	return <BodyWidget app={app}/>;
}

export default Diagram;