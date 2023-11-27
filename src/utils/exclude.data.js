module.exports = {
    exclude: (model, keys) => {
        return Object.fromEntries(
            Object.entries(model).filter(([key]) => !keys.includes(key))
        );
    }
}