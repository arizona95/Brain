import universal from 'react-universal-component';

export const UniversalComponent = universal(props => import(`./${props.page}`));
