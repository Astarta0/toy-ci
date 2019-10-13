// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const error = err.message || '500:\nSorry, it\'s me, not you!   🙀';
    res.status(500);
    res.set({ 'Content-Type': 'text/plain; charset=utf-8' });
    res.send(error);
};
