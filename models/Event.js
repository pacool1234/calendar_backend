const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Por favor, proporciona un título para el evento'],
    },
    description: {
        type: String,
        required: [true, 'Por favor, proporciona una descripción para el evento'],
    },
    start_date: {
        type: Date,
        required: [true, 'Por favor, proporciona una fecha de inicio para el evento'],
    },
    end_date: {
        type: Date,
        required: [true, 'Por favor, proporciona una fecha de finalización para el evento'],
    },
    confirmed_users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Por favor, proporciona los usuarios confirmados para el evento']
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
