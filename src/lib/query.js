// 从query中根据名字获取值
const getParam = name => {
    const query = window.location.search.split('&');
    if (query[0] === '') {
        return null;
    }
    query[0] = query[0].split('?')[1];
    window.console.log(query);
    const queryObj = {};

    for (let i = 0; i < query.length; i++) {
        const item = query[i].split('=');
        queryObj[item[0]] = item[1];
    }
    if (!queryObj.hasOwnProperty(name)) {
        return null;
    }
    return queryObj[name];
};

const updateParam = (name, value) => {
    const query = window.location.search.split('&');
    if (query[0] === '') {
        return `${name}=${value}`;
    }
    query[0] = query[0].split('?')[1];
    const queryObj = {};


    for (let i = 0; i < query.length; i++) {
        const item = query[i].split('=');
        queryObj[item[0]] = item[1];
    }

    queryObj[name] = value;

    let qs = '';
    for (const key in queryObj) {
        if (qs !== '') {
            qs += '&';
        }
        qs += `${key}=${queryObj[key]}`;
        window.console.log(qs);
    }
    
    return qs;

};

export { getParam, updateParam };
