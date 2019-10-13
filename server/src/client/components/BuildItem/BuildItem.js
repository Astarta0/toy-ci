import React from 'react';
import { Link } from 'react-router-dom';

const BuildItem = props => {
    const { id, status } = props.build;
    return (
        <div>
            <Link to={`/build/${id}`}>{id}</Link>
            ---- {status}
        </div>
    );
};

export default BuildItem;
