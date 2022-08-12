const LOGIN = 'scratch-gui/session/LOGIN';
const LOGOUT = 'scratch-gui/session/LOGOUT';

const initialState = {
    session: {}
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case LOGIN:
        return Object.assign({}, state, {
            session: {user: {username: '不学网'}}
        });
    case LOGOUT:
        return Object.assign({}, state, {
            session: null
        });
    default:
        return state;
    }
};
const login = user => ({
    type: LOGIN,
    user
});
const logout = () => ({
    type: LOGOUT
});

export {
    reducer as default,
    initialState as sessionState,
    login,
    logout
};
