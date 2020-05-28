function set(name, content = null) {
    if (!name) return;
    if (!content) return localStorage.removeItem(name);
    content = typeof content === 'string' ? content : JSON.stringify(content);
    localStorage.setItem(name, content);
}
function get(name) {
    return name ? localStorage.getItem(name) : null;
}

export default {
    set,
    get,
}