import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

@withRouter
@connect(
    (state, props) => {
        const { match: { params } } = props;
        const currentBuildId = params.id;
        const currentBuild = state.builds[currentBuildId] || null;

        return {
            currentBuild
        };
    }
)
export default class BuildPage extends Component {
    componentDidMount() {
        //todo update build info from server
    }

    render() {
        const { currentBuild } = this.props;

        if(!currentBuild) return <Redirect to='/notFound'/>;

        return (
            <div>
                build page
            </div>
        );
    }
}
