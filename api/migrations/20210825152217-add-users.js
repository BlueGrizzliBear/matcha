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
    email: {
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
    activated: {
      type: 'bool',
      notNull: true,
      default: false

    },
    gender: 'string',
    preference: 'string',
    bio: 'string'
    // interests: {
    //   type: 'int',
    //   foreignKey: {
    //     name: 'interests_id',
    //     table: 'interests',
    //     // rules: {
    //       // onDelete: 'CASCADE',
    //       // onUpdate: 'RESTRICT'
    //     // },
    //     mapping: 'id'
    //     }
    //   }
    // pictures:{
    //   type: 'int',
    //   foreignKey: {
    //     name: 'pictures_id',
    //     table: 'puctures',
    //     // rules: {
    //       // onDelete: 'CASCADE',
    //       // onUpdate: 'RESTRICT'
    //     // },
    //     mapping: 'id'
    //     }
    //   }
  });
};

exports.down = function (db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
