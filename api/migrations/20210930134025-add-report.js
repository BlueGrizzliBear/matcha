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
  return db.createTable('reports', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    reporting_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'reporting_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          reporting_user_id: 'id'
        }
      }
    },
    reported_user_id:
    {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'reported_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          reported_user_id: 'id'
        }
      }
    },
    reason: {
      type: 'string',
      notNull: true,
    },
  })
    .then(
      function (result) {
        return db.runSql('ALTER TABLE reports ADD CONSTRAINT uc_reporting_reported UNIQUE (reporting_user_id, reported_user_id)',
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
  return db.dropTable('reports');
};

exports._meta = {
  "version": 1
};
