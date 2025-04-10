const { monitorEventLoopDelay } = require("perf_hooks");

module.exports = (sequelize, DataTypes) => {
    let model = sequelize.define('car', {
      marca: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      model: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      an_fabricatie: {
        type: DataTypes.INTEGER,
        validate: {
          max: 9999
        }
      },
      capacitate: {
        type: DataTypes.INTEGER,
        validate: {
          max: 9999
        }
      },
      taxa: {
        type: DataTypes.INTEGER,
        validate: {
          max: 9999
        }
      }
    }, {
      timestamps: true
    });

    model.associate = models => {
      model.belongsToMany(models.person, {
        through: 'person_car',
        foreignKey: 'id_car',
        otherKey: 'id_person'
      });
    };
  
    return model;
  };