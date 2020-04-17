// @flow
import React from 'react';


export type Props = {
  history: Object,
  match: Object,
};

class RoutedComponent<Props: Props, State: ?{} = null> extends React.Component<Props, State> {
  pageTransitionMap: Object;

  onDocumentKeydown = (e: KeyboardEvent): void => {
    const { history } = this.props;
    if (Object.prototype.hasOwnProperty.call(this.pageTransitionMap, e.code)) {
      let location = this.pageTransitionMap[e.code];
      if (typeof location === 'function') {
        location = location();
      }
      history.push(location);
    }
  };

  constructor(props: Props) {
    super(props);
    this.pageTransitionMap = {};
  }

  componentDidMount() {
    window.document.addEventListener('keydown', this.onDocumentKeydown);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.onDocumentKeydown);
  }

  setPageTransitionMap(map: { +[string]: string | Function }) {
    this.pageTransitionMap = map;
  }
}

export default RoutedComponent;
