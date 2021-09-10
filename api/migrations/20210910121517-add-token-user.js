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
  return db.createTable('token_user', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    token_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'token_user_id_fk',
        table: 'tokens',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          token_id: 'id'
        }
      }
    },
    user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'user_token_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          user_id: 'id'
        }
      }
    },
  });
};

exports.down = function (db) {
  return db.dropTable('token_user');
};

exports._meta = {
  "version": 1
};
