import {getUser} from '../lib/user';

const LOGIN = 'scratch-gui/session/LOGIN';
const LOGOUT = 'scratch-gui/session/LOGOUT';


const initialState = {
    session: JSON.parse(getUser())
};


const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case LOGIN:
        return Object.assign({}, state, {
            session: action.user
        });
    case LOGOUT:
        return Object.assign({}, state, {
            session: null
        });
    default:
        return state;
    }
};


export {
    reducer as default,
    initialState as sessionState
};
