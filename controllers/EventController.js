const Event = require('../models/Event');

// Controlador para crear un evento
exports.createEvent = async (req, res) => {
    const event = new Event({
        ...req.body,
        image: req.file ? req.file.path : null // Asume que multer coloca el archivo cargado en req.file
    });

    try {
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Controlador para obtener todos los eventos
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).populate('confirmed_users').populate('invited_users');
        res.send(events);
    } catch (error) {
        res.status(500).send();
    }
};

// Controlador para obtener un evento por su ID
exports.getEventById = async (req, res) => {
    const _id = req.params.id;

    try {
        const event = await Event.findById(_id).populate('confirmed_users').populate('invited_users');
        if (!event) {
            return res.status(404).send();
        }
        res.send(event);
    } catch (error) {
        res.status(500).send();
    }
};

// Controlador para actualizar un evento
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!event) {
            return res.status(404).send();
        }

        res.send(event);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Controlador para eliminar un evento
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).send();
        }

        res.send(event);
    } catch (error) {
        res.status(500).send();
    }
};

// Controlador para confirmar asistencia a un evento
exports.confirmAttendance = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send();
        }
        // Agregar usuario a la lista de asistentes confirmados si no está ya en la lista
        if (!event.confirmed_users.includes(req.user._id)) {
            event.confirmed_users.push(req.user._id);
            await event.save();
        }
        res.send(event);
    } catch (error) {
        res.status(500).send();
    }
};

// Controlador para cancelar asistencia a un evento
exports.cancelAttendance = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send();
        }
        // Quitar al usuario de la lista de asistentes confirmados
        event.confirmed_users.pull(req.user._id);
        await event.save();
        res.send(event);
    } catch (error) {
        res.status(500).send();
    }
};

// Controlador para invitar un usuario a un evento
exports.inviteUser = async (req, res) => {
    // Esta función asume que se ha enviado el id del usuario a invitar en el cuerpo de la solicitud
    // y que tienes una lista separada de usuarios invitados en tu modelo de Evento
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send();
        }
        if (!event.invited_users.includes(req.body.userId)) {
            event.invited_users.push(req.body.userId);
            await event.save();
        }
        res.send(event);
    } catch (error) {
        res.status(500).send();
    }
};

// Controlador para desinvitar un usuario a un evento
exports.uninviteUser = async (req, res) => {
    // Esta función asume que se ha enviado el id del usuario a desinvitar en el cuerpo de la solicitud
    // y que tienes una lista separada de usuarios invitados en tu modelo de Evento
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send();
        }
        event.invited_users.pull(req.body.userId);
        await event.save();
        res.send(event);
    } catch (error) {
        res.status(500).send();
    }
};

module.exports = {
    // tus otros exportaciones aquí...
    confirmAttendance,
    cancelAttendance,
    inviteUser,
    uninviteUser,
};