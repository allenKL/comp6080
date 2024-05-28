function saveToLocal(dataType, data) {
    localStorage.setItem(dataType,data);
}

function getFromLocal(dataType) {
    return localStorage.getItem(dataType);
}

function removeFromLocal(dataType) {
    localStorage.removeItem(dataType);
}

export { saveToLocal, getFromLocal, removeFromLocal }