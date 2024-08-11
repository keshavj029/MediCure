// models/patient.js

const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required:true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'other'],
    },
    // Appointments associated with this patient
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointments',
    }],
});

const PatientModel = mongoose.model('Patients', patientSchema);

module.exports = PatientModel;
