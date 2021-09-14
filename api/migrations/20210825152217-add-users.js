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
  return db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: 'string',
      notNull: true,
      unique: true
    },
    password: {
      type: 'string',
      notNull: true
    },
    firstname: {
      type: 'string',
      notNull: true
    },
    lastname: {
      type: 'string',
      notNull: true
    },
    email: {
      type: 'string',
      notNull: true,
      unique: true
    },
    birth_date: 'date',
    gender: 'string',
    preference: {
      type: 'string',
      defaultValue: "Bisexual",
      notNull: true
    },
    bio: 'string',
    img0_path: {
      type: 'string'
    },
    img1_path: {
      type: 'string'
    },
    img2_path: {
      type: 'string'
    },
    img3_path: {
      type: 'string'
    },
    img4_path: {
      type: 'string'
    },
    activated: {
      type: 'boolean',
      defaultValue: false,
      notNull: true
    },
    complete: {
      type: 'boolean',
      defaultValue: false,
      notNull: true
    },
  });
};

exports.down = function (db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
