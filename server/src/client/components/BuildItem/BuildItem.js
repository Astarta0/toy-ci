import React from 'react';
import { Link } from 'react-router-dom';

import s from './BuildItem.css';

const BuildItem = props => {
    const { id, status } = props.build;
    return (
        <div className={s.root}>
            <Link to={`/build/${id}`} className={s.link}>{id}</Link>
            <span className={s.status}>{status}</span>
        </div>
    );
};

export default BuildItem;
