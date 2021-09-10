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
  return db.createTable('watches', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    watching_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'watching_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          watching_user_id: 'id'
        }
      }
    },
    watched_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'watched_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          watched_user_id: 'id'
        }
      }
    },
  });
};

exports.down = function (db) {
  return db.dropTable('watches');
};

exports._meta = {
  "version": 1
};
