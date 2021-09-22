'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.runSql('ALTER TABLE likes ADD CONSTRAINT uc_liking_liked UNIQUE (liking_user_id, liked_user_id)',
    (err) => {
      if (err)
        console.log(err);
    });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
