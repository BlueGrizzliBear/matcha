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
  return db.createTable('likes', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    liking_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'liking_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          liking_user_id: 'id'
        }
      }
    },
    liked_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'liked_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          liked_user_id: 'id'
        }
      }
    },
  })
    .then(
      function (result) {
        return db.runSql('ALTER TABLE likes ADD CONSTRAINT uc_liking_liked UNIQUE (liking_user_id, liked_user_id)',
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
  return db.dropTable('likes');
};

exports._meta = {
  "version": 1
};
