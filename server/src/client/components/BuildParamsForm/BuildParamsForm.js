import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '/src/client/components/Input';
import Textarea from '/src/client/components/Textarea';
import Button from '/src/client/components/Button';
import * as actions from '/src/client/actions/actions';

import s from './BuildparamsForm.css';

@connect(
    state => ({
        waiting: state.waiting,
        error: state.error
    }),
    dispatch => ({
        runBuild: ({ commitHash, command }) => dispatch(actions.runBuild({commitHash, command})),
    })
)

export default class BuildParamsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            commitHash: {
                value: ''
            },
            command: {
                value: ''
            }
        };
    }

    handleChange = e => {
        const { currentTarget } = e;

        this.setState({
            [currentTarget.name]: {
                value: currentTarget.value
            }
        })
    };

    handleClick = () => {
        const { runBuild } = this.props;
        const { commitHash, command } = this.state ;

        if(!command.value || !commitHash.value) return;

        runBuild({
            commitHash: commitHash.value,
            command: command.value
        });

        this.setState({
            commitHash: {
                value: ''
            },
            command: {
                value: ''
            }
        });
    };


    render() {
        const { commitHash: { value: commitHashValue }, command: { value: commandValue } } = this.state;
        const { waiting } = this.props;

        return (
            <>
                <Input
                    name="commitHash"
                    className={s.textField}
                    type="text"
                    placeholder="Enter commitHash..."
                    value={commitHashValue}
                    onChange={this.handleChange}
                    required
                />
                <Textarea
                    name="command"
                    className={s.textField}
                    type="text"
                    value={commandValue}
                    placeholder="Enter build command..."
                    onChange={this.handleChange}
                    required
                />
                <Button onClick={this.handleClick} className={s.btn}>
                    Run build!
                </Button>

                {waiting && <p>Please wait... </p>}
            </>
        );
    }
}
