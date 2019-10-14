import React, { Component } from 'react';
import { connect } from 'react-redux';

import BuildParamsForm from '/src/client/components/BuildParamsForm';
import BuildItem from '/src/client/components/BuildItem';
import * as actions from '/src/client/actions/actions';

import s from './IndexPage.css';

@connect(
    state => ({
        builds: state.builds
    }),
    {
        fetchBuilds: actions.fetchBuilds
    }
)
export default class IndexPage extends Component {
    componentDidMount() {
        this.props.fetchBuilds();
        setInterval(() => this.props.fetchBuilds(), 3000);
    }
    render() {
        const { builds } = this.props;
        const buildEntries =  Object.entries(builds);

        return (
            <>
                <BuildParamsForm></BuildParamsForm>

                <div className={s.root}>
                    { buildEntries.length > 0 && buildEntries.map(entries => {
                        const [ buildID, build ] = entries;
                        return (
                            <BuildItem key={buildID} build={build}/>
                        );
                    })}
                </div>
            </>
        );
    }
}
