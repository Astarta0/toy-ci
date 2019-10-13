import axios from 'axios';

import * as TYPE from './types';

const apiUrl = '/api/v1/build/';

export const runBuild = ({ commitHash, command }) => async dispatch => {
    dispatch({
        type: TYPE.RUN_BUILD_PENDING
    });

    try {
        const { data } = await axios.post(apiUrl, {
            commitHash,
            command
        });

        if(data && data.build ) {
            dispatch({
                type: TYPE.RUN_BUILD_SUCCESS,
                payload: {
                    build: data.build
                }
            });
        } else {
            throw new Error('Cannot run build!');
        }

    } catch(e) {
        console.error(e);
        dispatch({
            type: TYPE.RUN_BUILD_FAIL,
            payload: { error: e.message }
        });
    }
};

export const fetchBuilds = () => async dispatch => {
    dispatch({
        type: TYPE.FETCH_BUILDS_PENDING
    });
    try {
        const { data } = await axios.get(apiUrl + '/builds');
        dispatch({
            type: TYPE.FETCH_BUILDS_SUCCESS,
            payload: {
                builds: data.builds
            }
        });
    } catch(e) {
        console.error(e);
        dispatch({
            type: TYPE.FETCH_BUILDS_FAIL,
            payload: { error: e.message }
        });
    }
};


export const getStats = () => async dispatch => {
    // dispatch({
    //     type: TYPE.RUN_BUILD_PENDING
    // });

    try {
        const { data } = await axios.get(apiUrl + '/stats');
        console.clear();
        console.table(data.queue);
        console.table(data.builds);
        console.table(data.agents);
        console.table(data.free);

    } catch(e) {
        // console.error(e);
        // dispatch({
        //     type: TYPE.RUN_BUILD_FAIL,
        //     payload: { error: e.message }
        // });
    }
};
