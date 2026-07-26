function delay(ms=1000) {
    return (req, res, next) => {
        setTimeout(next, ms);
    }
}

export { delay }