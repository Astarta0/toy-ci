import { keyBy } from 'lodash-es';
import * as TYPE from 'src/client/actions/types';

const INITIAL_STATE = {
    builds: {},
    error: null,
    waiting: false
};

export default function rootReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
    case TYPE.RUN_BUILD_PENDING:
    case TYPE.FETCH_BUILD_INFO_PENDING: {
        return {
            ...state,
            waiting: true,
        }
    }

    case TYPE.RUN_BUILD_FAIL:
    case TYPE.FETCH_BUILD_INFO_FAIL: {
        return {
            ...state,
            waiting: false,
            error: action.payload.error
        }
    }

    case TYPE.RUN_BUILD_SUCCESS: {
        const { build }  = action.payload;

        return {
            ...state,
            waiting: false,
            error: null,
            builds: {
                ...state.builds,
                [build.id]: {
                    ...build
                }
            }
        }
    }

    case TYPE.FETCH_BUILDS_SUCCESS: {
        const { builds }  = action.payload;

        return {
            ...state,
            waiting: false,
            error: null,
            builds: keyBy(builds, 'id')
        }
    }

    case TYPE.FETCH_BUILD_INFO_SUCCESS: {
        const { build } = action.payload;

        return {
            ...state,
            waiting: false,
            error: null,
            builds: {
                ...state.builds,
                [build.id]: build
            }

        };
    }

    default:
        return state;
    }
}
