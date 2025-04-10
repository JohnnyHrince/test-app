const { monitorEventLoopDelay } = require("perf_hooks");

module.exports = (sequelize, DataTypes) => {
    let model = sequelize.define('person_car', {
        id_person: {
            type: DataTypes.INTEGER,
            references: {
              model: 'person',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          id_car: {
            type: DataTypes.INTEGER,
            references: {
              model: 'car',
              key: 'id'
            },
            onDelete: 'CASCADE'
          }
        }, {
          tableName: 'person_car',
          timestamps: false
        });
  
    return model;
  };