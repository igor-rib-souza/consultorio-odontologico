// consultaModel.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Paciente from './paciente.js';

class Consulta extends Model {}

Consulta.init({
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaInicial: {
    type: DataTypes.STRING,
    allowNull: false
  },
  horaFinal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    references: {
      model: Paciente,
      key: 'cpf'
    }
  }
}, {
  sequelize,
  modelName: 'consulta'
});

Paciente.hasMany(Consulta, { foreignKey: 'cpf' });
Consulta.belongsTo(Paciente, { foreignKey: 'cpf' });

export default Consulta;
