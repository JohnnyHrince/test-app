const { monitorEventLoopDelay } = require("perf_hooks");

module.exports = (sequelize, DataTypes) => {
    let model = sequelize.define('person', {
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      cnp: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true
    });

    model.associate = models => {
      model.belongsToMany(models.car, {
        through: 'person_car',
        foreignKey: 'id_person',
        otherKey: 'id_car'
      });
    }
    return model;
  };