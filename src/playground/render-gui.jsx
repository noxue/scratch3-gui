import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import xhr from 'xhr';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import log from '../lib/log.js';
import { getToken, getTokenName, getUser } from '../lib/user.js';
import { getParam } from '../lib/query.js';

const onClickLogo = () => {
    window.location = 'https://noxue.com';
};

const handleTelemetryModalCancel = () => {
    log('User canceled telemetry modal');
};

const handleTelemetryModalOptIn = () => {
    log('User opted into telemetry');
};

const handleTelemetryModalOptOut = () => {
    log('User opted out of telemetry');
};

const token = getToken();
setInterval(() => {
    if (token !== getToken()) {
        window.location.reload();
    }
}, 3000);

// 更新封面图
const saveThumbnail = (projectId, data) => {
    const headers = {
        'Content-Type': 'multipart/form-data'
    };
    const tokenName = getTokenName();
    const tokenValue = getToken();
    if (tokenName && tokenValue) {
        headers[tokenName] = tokenValue;
    }

    const opts = {
        method: 'put',
        url: `http://127.0.0.1:8000/thumbnail/${projectId}`,
        body: data,
        headers,
        withCredentials: true
    };
    new Promise((resolve, reject) => {
        xhr(opts, (err, response) => {
            if (err) return reject(err);
            if (response.statusCode !== 200) return reject(response.statusCode);
            let body;
            try {
                // Since we didn't set json: true, we have to parse manually
                body = JSON.parse(response.body);
            } catch (e) {
                return reject(e);
            }
            body.id = projectId;

            resolve(body);
        });
    }).then(res => log.debug(res));
};

/*
 * Render the GUI playground. This is a separate function because importing anything
 * that instantiates the VM causes unsupported browsers to crash
 * {object} appTarget - the DOM element to render to
 */
export default appTarget => {
    GUI.setAppElement(appTarget);

    // note that redux's 'compose' function is just being used as a general utility to make
    // the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
    // ability to compose reducers.
    const WrappedGui = compose(
        AppStateHOC,
        HashParserHOC
    )(GUI);

    // TODO a hack for testing the backpack, allow backpack host to be set by url param
    const backpackHostMatches = window.location.href.match(/[?&]backpack_host=([^&]*)&?/);
    const backpackHost = backpackHostMatches ? backpackHostMatches[1] : null;

    const scratchDesktopMatches = window.location.href.match(/[?&]isScratchDesktop=([^&]+)/);
    let simulateScratchDesktop;
    if (scratchDesktopMatches) {
        try {
            // parse 'true' into `true`, 'false' into `false`, etc.
            simulateScratchDesktop = JSON.parse(scratchDesktopMatches[1]);
        } catch {
            // it's not JSON so just use the string
            // note that a typo like "falsy" will be treated as true
            simulateScratchDesktop = scratchDesktopMatches[1];
        }
    }

    if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
        // Warn before navigating away
        window.onbeforeunload = () => true;
    }

    const id = getParam('id') ?? 0;
    
    ReactDOM.render(
        // important: this is checking whether `simulateScratchDesktop` is truthy, not just defined!
        simulateScratchDesktop ?
            <WrappedGui
                canEditTitle
                isScratchDesktop
                showTelemetryModal
                canSave={false}
                onTelemetryModalCancel={handleTelemetryModalCancel}
                onTelemetryModalOptIn={handleTelemetryModalOptIn}
                onTelemetryModalOptOut={handleTelemetryModalOptOut}
            /> :
            <WrappedGui
                canEditTitle
                showComingSoon={false}
                // backpackHost="http://127.0.0.1:8000/backpack"
                canSave={!!(getToken() && getUser())}
                canCreateNew={!!(getToken() && getUser())}
                // renderLogin={() => {return "xxxx";}}
                projectId={id}
                onClickLogo={onClickLogo}
                logo="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"
                canModifyCloudData
                onUpdateProjectThumbnail={saveThumbnail}
                projectHost={'http://127.0.0.1:8000/api/scratch/projects'}
                assetHost={'http://127.0.0.1:8000/assets'}
            />,
        appTarget);
};
