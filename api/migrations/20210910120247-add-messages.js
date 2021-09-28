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
  return db.createTable('messages', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    sender_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'sender_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          sender_user_id: 'id'
        }
      }
    },
    receiver_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'receiver_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          receiver_user_id: 'id'
        }
      }
    },
    message: {
      type: 'string',
      notNull: true,
    },
    read: {
      type: 'boolean',
      defaultValue: false,
      notNull: true
    }
    // sent_date: {
    //   type: 'datetime',
    //   defaultValue: CURRENT_TIMESTAMP
    // }
  })
    .then(
      function (result) {
        return db.runSql('ALTER TABLE messages ADD sent_date DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)',
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
  return db.dropTable('messages');
};

exports._meta = {
  "version": 1
};
