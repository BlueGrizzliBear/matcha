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
      defaultValue: "Man-Woman-NonBinary",
      notNull: true
    },
    city: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    location_mode: {
      type: 'boolean',
      defaultValue: false,
      notNull: true
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
    fake: {
      type: 'boolean',
      defaultValue: false,
      notNull: true
    },
  })
    .then(
      function (result) {
        return db.runSql('ALTER TABLE users ADD COLUMN gps_lat DECIMAL(12,8), ADD COLUMN gps_long DECIMAL(12,8), ADD COLUMN bio LONGTEXT, ADD COLUMN img0_path LONGTEXT, ADD COLUMN img1_path LONGTEXT, ADD COLUMN img2_path LONGTEXT, ADD COLUMN img3_path LONGTEXT, ADD COLUMN img4_path LONGTEXT',
          (err) => {
            if (err)
              console.log(err);
          });
      },
      function (err) {
        return;
      }
    );
};

exports.down = function (db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
