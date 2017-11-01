const NodeCache = require("node-cache"),
    db = new NodeCache();

module.exports = {
    /**
     * GET Collection
     * @param key
     */
    get: (key) => db.get(key),

    /**
     * Set Collection
     * @param key
     * @param value
     */
    set: (key, value) => db.set(key, value)
};