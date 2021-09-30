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
  return db.createTable('blocklist', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    blocking_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'blocking_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          blocking_user_id: 'id'
        }
      }
    },
    blocked_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'blocked_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          blocked_user_id: 'id'
        }
      }
    },
  })
    .then(
      function (result) {
        return db.runSql('ALTER TABLE blocklist ADD CONSTRAINT uc_blocking_blocked UNIQUE (blocking_user_id, blocked_user_id)',
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
  return db.dropTable('blocklist');
};

exports._meta = {
  "version": 1
};
