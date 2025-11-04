const mongoose = require('mongoose');
const empleadoSchema = new mongoose.Schema({
    cargo: { type: String, required: true }
});

module.exports = mongoose.model('Empleado', empleadoSchema);
