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
  return db.createTable('tags', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    tag: {
      type: 'string',
      notNull: true,
      unique: true
    },
  });
};

exports.down = function (db) {
  return db.dropTable('tags');
};

exports._meta = {
  "version": 1
};
