'use strict';
const { UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const detalle = sequelize.define('detalle', {
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    }, {
        freezeTableName: true
    });

    detalle.associate = function (models) {
        detalle.belongsTo(models.auto, { foreignKey: 'id_auto' });
        detalle.belongsTo(models.factura, { foreignKey: 'id_factura' });
    }

    return detalle;
};