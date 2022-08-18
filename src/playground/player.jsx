import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Box from '../components/box/box.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';

import { setPlayer } from '../reducers/mode';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

import styles from './player.css';

const Player = ({projectId, projectHost, assetHost}) => (
    <Box className={classNames(styles.stageOnly)}>
        <GUI
            showBranding
            isPlayerOnly
            projectId={projectId}
            projectHost={projectHost}
            assetHost={assetHost}
        />
    </Box>
);

Player.propTypes = {
    projectId: PropTypes.string,
    projectHost: PropTypes.string,
    assetHost: PropTypes.string
};

const mapStateToProps = state => ({
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly
});

const mapDispatchToProps = dispatch => ({
    onSeeInside: () => dispatch(setPlayer(false))
});

const ConnectedPlayer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedPlayer = compose(
    AppStateHOC,
    HashParserHOC
)(ConnectedPlayer);

const appTarget = document.getElementById('scratch-player') ?? document.createElement('div');
const projectHost = 'http://127.0.0.1:8000/api/scratch/projects';
const assetHost = 'http://127.0.0.1:8000/assets';

document.body.appendChild(appTarget);

ReactDOM.render(<WrappedPlayer
    isPlayerOnly
    projectHost={projectHost}
    assetHost={assetHost}
/>, appTarget);
