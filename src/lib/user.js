const TOKEN_NAME = 'noxue_scratch_token_name';
const TOKEN_VALUE = 'noxue_scratch_token_value';
const USER_KEY = 'noxue_scratch_user';

const setToken = value => {
    window.localStorage.setItem(TOKEN_VALUE, value);
};

const setTokenName = value => {
    window.localStorage.setItem(TOKEN_NAME, value);
};

const getToken = () => window.localStorage.getItem(TOKEN_VALUE);

const getTokenName = () => window.localStorage.getItem(TOKEN_NAME) ?? 'token';

const clearToken = () => {
    window.localStorage.removeItem(TOKEN_NAME);
    window.localStorage.removeItem(TOKEN_VALUE);
};

// 用户管理
const setUser = user => window.localStorage.setItem(USER_KEY, user);
const getUser = () => window.localStorage.getItem(USER_KEY);
const removeUser = () => window.localStorage.clearItem(USER_KEY);

export {
    setToken,
    getToken,
    setTokenName,
    getTokenName,
    clearToken,
    setUser,
    getUser,
    removeUser
};
