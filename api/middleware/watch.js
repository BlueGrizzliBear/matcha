var Models = require('../models/models');

// middleware to use on path everytime user acces sensitiv data
// check if a token exist and is valid
const watchedUser = function (req, res, next) {
    const watchedUser = new Models.User(null, req.params['username'])
    watchedUser.find((err, results) => {
        if (err) {
            console.log(err);
            res.status(400).end();
        }
        else {
            const watch = new Models.Watch(res.locals.results.id, results[0].id);
            watch.create((watcherr, watchres) => {
                if (watcherr) {
                    console.log(watcherr);
                    next();
                }
                else {
                    next();
                }
            })
        }
    });
}

module.exports = watchedUser;