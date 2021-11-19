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
  return db.createTable('tag_user', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    tag_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'tag_user_id_fk',
        table: 'tags',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          tag_id: 'id'
        }
      }
    },
    user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'user_tag_id_fk',
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
  })
    .then(
      function (result) {
        return db.runSql('ALTER TABLE tag_user ADD CONSTRAINT uc_tag_user UNIQUE (tag_id, user_id)',
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
  return db.dropTable('tag_user');
};

exports._meta = {
  "version": 1
};
