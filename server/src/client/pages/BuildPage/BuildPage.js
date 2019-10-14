import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from 'src/client/actions/actions';
import { formatTimestampData } from 'src/client/utils';

@withRouter
@connect(
    (state, props) => {
        const { match: { params } } = props;
        const currentBuildId = params.id;

        const currentBuild = state.builds[currentBuildId] || null;

        return {
            currentBuild
        };
    },
    {
        fetchBuildInfo: actions.fetchBuildInfo
    }
)
export default class BuildPage extends Component {

    componentDidMount() {
        const { fetchBuildInfo,  match: { params } } = this.props;
        const currentBuildId = params.id;
        fetchBuildInfo(currentBuildId);
    }

    render() {
        const { currentBuild } = this.props;

        if(!currentBuild) return <div>There is no such build</div>;

        const { code, command, commitHash, id, repositoryUrl, status, stderr, stdout, triggered, start, finished } = currentBuild;

        return (
            <div>
                <div>Repository URL: {repositoryUrl}</div>
                <div>Branch: {commitHash}</div>
                <div>Build id: {id}</div>

                <div>Triggered at {formatTimestampData(triggered)}</div>
                <div>Start at {formatTimestampData(start)}</div>
                <div> Finished at {formatTimestampData(finished)}</div>

                <br />
                <div>Status: {status} {code && <span>(code {code})</span>}</div>
                <div>Build command: {command}</div>
                <br />
                <div>
                    <div>
                        Errors & warnings:
                        <div>{stderr}</div>
                    </div>
                    <br />
                    <div>
                        Build output:
                        <div>{stdout}</div>
                    </div>
                </div>
            </div>
        );
    }
}
