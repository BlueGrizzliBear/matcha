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
  return db.createTable('notifications', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'user_id_fk',
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
    message_id:
    {
      type: 'int',
      defaultValue: null,
      foreignKey: {
        name: 'message_id_fk',
        table: 'messages',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          message_id: 'id'
        }
      }
    },
    like_id:
    {
      type: 'int',
      defaultValue: null,
      foreignKey: {
        name: 'like_id_fk',
        table: 'likes',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          like_id: 'id'
        }
      }
    },
    watch_id:
    {
      type: 'int',
      defaultValue: null,
      foreignKey: {
        name: 'watch_id_fk',
        table: 'watches',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          watch_id: 'id'
        }
      }
    }
  })
    .then(
      function (result) {
        db.runSql('ALTER TABLE notifications ADD sent_date DATETIME DEFAULT CURRENT_TIMESTAMP',
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
  return null;
};

exports._meta = {
  "version": 1
};
