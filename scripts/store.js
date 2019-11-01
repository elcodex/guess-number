let store = new Map();

exports.getInfo = (sessionId, firstVisit) => {
    if (!store.has(sessionId)) {
       store.set(sessionId, {}); 
    }
    return store.get(sessionId);
}
exports.remove = (sessionId, firstVisit) => {
    store.remove(sessionId);
}
exports.addParam = (sessionId, {key, value}) => {
    let params = {};
    if (store.has(sessionId)) {
        params = store.get(sessionId);
    }
    params[key] = value;
    store.set(sessionId, params);
}
exports.addKey = (sessionId) => {
    if (!store.has(sessionId)) {
        store.set(sessionId, {});
    }
}
exports.getParam = (sessionId, param) => {
    if (store.has(sessionId)) {
        return store.get(sessionId)[param];
    }
    return undefined;
}
exports.clearKey = (sessionId) => {
    store.set(sessionId, {});
}