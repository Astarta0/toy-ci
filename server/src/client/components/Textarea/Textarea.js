import React from 'react';
import classNames from 'classnames';

const Textarea = ({ className = '', value, placeholder, autofocus = false, onChange, disabled = false, required = false, name }) => (
    <textarea
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

export default Textarea;
