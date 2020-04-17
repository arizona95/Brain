import React from 'react';
import classNames from 'classnames';
import { CustomInput as RSCustomInput } from 'reactstrap';
import styles from './CustomInput.scss';

const CustomInput = (props) => {
  const { className, ...otherProps } = props;
  const inputClass = classNames(className, {
    'custom-control-empty': !props.label,
  });

  return (
    <RSCustomInput className={ inputClass }  { ...otherProps }
      innerRef =  {(el) => {
      if (el) {
        el.style.setProperty('border-color', '#de1ba2', 'important');
      }
    }}/>
  );
};
CustomInput.propTypes = { ...RSCustomInput.propTypes };

export { CustomInput };
