import React from 'react';
import classNames from 'classnames';

import s from './Button.css';

const Button = ({ children, className = '', onClick = () => {}, type }) => (
    <button className={classNames(s.button, className)} type={type || 'button'} onClick={onClick}>
        {children}
    </button>
);

export default Button;
