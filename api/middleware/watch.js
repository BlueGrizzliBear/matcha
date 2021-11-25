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
                    next();
                }
                else {
                    // TODO: trigger websocket event
                    const notification = new Models.Notification(results[0].id, 3, watchres.insertId);
                    notification.create((nerr, nres) => {
                        if (nerr) {
                            console.log(nerr);
                            res.status(400).end();
                        }
                        else {
                            next();
                        }
                    });
                }
            })
        }
    });
}

module.exports = watchedUser;
