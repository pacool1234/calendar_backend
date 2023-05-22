const Event = require('../models/Event');

// Controlador para crear un evento
exports.createEvent = async (req, res) => {
    // Comprobar si el usuario es admin
    if (req.user.role !== 'admin') {
        return res.status(403).send({message: "Requiere ser administrador para realizar esta acción"});
    }

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
        const events = await Event.find({});
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para obtener un evento por su ID
exports.getEventById = async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await Event.findById(eventId);
        if(!event) {
            return res.status(404).send();
        }
        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para actualizar un evento
exports.updateEvent = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'date', 'location']; // Cambia esto según los campos que permitas actualizar
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Actualizaciones inválidas!' });
    }

    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send();
        }

        updates.forEach((update) => event[update] = req.body[update]);
        await event.save();
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
        res.status(500).send(error);
    }
};


// Controlador para confirmar asistencia a un evento
exports.confirmAttendance = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({message: 'Evento no encontrado'});
        }

        // Agregar usuario a la lista de asistentes confirmados si no está ya en la lista
        if (!event.confirmed_users.includes(req.user._id)) {
            event.confirmed_users.push(req.user._id);
            await event.save();
        }

        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para cancelar asistencia a un evento
exports.cancelAttendance = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({message: 'Evento no encontrado'});
        }

        // Eliminar usuario de la lista de asistentes confirmados si está en la lista
        const index = event.confirmed_users.indexOf(req.user._id);
        if (index > -1) {
            event.confirmed_users.splice(index, 1);
            await event.save();
        }

        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para invitar un usuario a un evento
exports.inviteUser = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({message: 'Evento no encontrado'});
        }

        // Agrega el ID del usuario invitado a la lista de usuarios invitados si aún no está en la lista
        const userId = req.body.userId;
        if (!event.invited_users.includes(userId)) {
            event.invited_users.push(userId);
            await event.save();
        }

        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para desinvitar un usuario a un evento
exports.uninviteUser = async (req, res) => {
    // Comprobar si el usuario es admin
    if (req.user.role !== 'admin') {
        return res.status(403).send({message: "Requiere ser administrador para realizar esta acción"});
    }

    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({message: 'Evento no encontrado'});
        }

        // Elimina el ID del usuario desinvitado de la lista de usuarios invitados si está en la lista
        const userId = req.body.userId;
        const index = event.invited_users.indexOf(userId);
        if (index > -1) {
            event.invited_users.splice(index, 1);
            await event.save();
        }

        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para obtener eventos a los que un usuario ha confirmado asistencia
exports.getEventsUserConfirmed = async (req, res) => {
    try {
        const userId = req.params.userId;
        const events = await Event.find({ confirmed_users: userId });
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para obtener eventos a los que un usuario ha sido invitado
exports.getEventsUserInvited = async (req, res) => {
    try {
        const userId = req.params.userId;
        const events = await Event.find({ invited_users: userId });
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para obtener eventos futuros
exports.getFutureEvents = async (req, res) => {
    try {
        const now = new Date();
        const events = await Event.find({ date: { $gt: now } });
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para obtener eventos pasados
exports.getPastEvents = async (req, res) => {
    try {
        const now = new Date();
        const events = await Event.find({ date: { $lt: now } });
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controlador para añadir una valoración y reseña a un evento
exports.addEventReview = async (req, res) => {
    const { eventId } = req.params;
    const { rating, review } = req.body;

    // Verificar si la reseña y la valoración fueron enviadas en la solicitud
    if (!rating || !review) {
        return res.status(400).send({ message: "La reseña y la valoración son obligatorias" });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send({ message: "Evento no encontrado" });
        }

        // Asegúrate de que 'reviews' sea un array en el modelo del evento
        event.reviews.push({
            rating,
            review,
            user: req.user._id,
            date: Date.now(),
        });

        await event.save();
        res.status(200).send(event);
    } catch (error) {
        res.status(500).send({ message: "Error al añadir la reseña y la valoración" });
    }
};

// Controlador para añadir un comentario a un evento
exports.addEventComment = async (req, res) => {
    const { eventId } = req.params;
    const { comment } = req.body;

    // Verificar si el comentario fue enviado en la solicitud
    if (!comment) {
        return res.status(400).send({ message: "El comentario es obligatorio" });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send({ message: "Evento no encontrado" });
        }

        // Asegúrate de que 'comments' sea un array en el modelo del evento
        event.comments.push({
            comment,
            user: req.user._id,
            date: Date.now(),
        });

        await event.save();
        res.status(200).send(event);
    } catch (error) {
        res.status(500).send({ message: "Error al añadir el comentario" });
    }
};
// Controlador para obtener un evento por su nombre
exports.getEventByName = async (req, res) => {
    const eventName = req.params.name;
    try {
        const event = await Event.findOne({ name: eventName });
        if(!event) {
            return res.status(404).send();
        }
        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
};


module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    confirmAttendance,
    cancelAttendance,
    inviteUser,
    uninviteUser,
    getEventsUserConfirmed,
    getEventsUserInvited,
    getFutureEvents,
    getPastEvents,
    addEventReview,
    addEventComment,
    getEventByName,
};
