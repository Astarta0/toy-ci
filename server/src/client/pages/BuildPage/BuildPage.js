import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import * as actions from 'src/client/actions/actions';

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
        fetchBuildInfo: actions.fetchBuilds
    }
)
export default class BuildPage extends Component {
    componentDidMount() {
        const { fetchBuildInfo, currentBuild } = this.props;

        console.log({ currentBuild });

        if (currentBuild) {
            fetchBuildInfo(currentBuild.id);
        }
    }

    render() {
        const { currentBuild } = this.props;
        if(!currentBuild) return <Redirect to='/notFound'/>;

        const { code, command, commitHash, id, repositoryUrl, status, stderr, stdout, triggered, start, finished } = currentBuild;
        // TODO даты

        return (
            <div>
                <div>Repository URL: {repositoryUrl}</div>
                <div>Branch: {commitHash}</div>
                <div>Build id: {id}</div>
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
