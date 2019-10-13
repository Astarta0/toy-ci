import React from 'react';
import classNames from 'classnames';

const Input = ({ className = '', value, placeholder, autofocus = false, onChange, disabled = false, required = false, name }) => (
    <input
        name={name}
        className={classNames(className)}
        value={value}
        autoFocus={autofocus}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required={required}
    />
);

export default Input;
