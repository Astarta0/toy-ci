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
            const errorMessage = data && data.error || 'Cannot run build!';
            throw new Error(errorMessage);
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

export const fetchBuildInfo = id => async dispatch => {
    dispatch({
        type: TYPE.FETCH_BUILD_INFO_PENDING
    });

    try {
        const { data } = await axios.get(apiUrl + `/${id}`);
        dispatch({
            type: TYPE.FETCH_BUILD_INFO_SUCCESS,
            payload: {
                build: data.build
            }
        });
    } catch(e) {
        console.error(e);
        dispatch({
            type: TYPE.FETCH_BUILD_INFO_FAIL,
            payload: { error: e.message }
        });
    }
};
