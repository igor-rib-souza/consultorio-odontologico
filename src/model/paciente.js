// pacienteModel.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

class Paciente extends Model {}

Paciente.init({
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'paciente'
});

export default Paciente;
