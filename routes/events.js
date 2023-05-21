const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/EventController');
const { uploadEventImg } = require('../middlewares/upload');
const { authentication } = require('../middlewares/authentication');

// Ruta para crear un nuevo evento
router.post('/events', authentication, uploadEventImg.single('image'), eventsController.createEvent);

// Ruta para obtener todos los eventos
router.get('/events', authentication, eventsController.getEvents);

// Ruta para obtener un evento por ID
router.get('/events/:id', authentication, eventsController.getEventById);

// Ruta para actualizar un evento
router.put('/events/:id', authentication, uploadEventImg.single('image'), eventsController.updateEvent);

// Ruta para eliminar un evento
router.delete('/events/:id', authentication, eventsController.deleteEvent);

// Ruta para que el usuario confirme la asistencia al evento
router.put('/events/:id/confirm', authentication, eventsController.confirmAttendance);

// Ruta para que el usuario cancele su asistencia
router.put('/events/:id/cancel', authentication, eventsController.cancelAttendance);

// Ruta para invitar usuarios a un evento
router.put('/events/:id/invite', authentication, eventsController.inviteUser);

// Ruta para revocar la invitación de un usuario
router.put('/events/:id/uninvite', authentication, eventsController.uninviteUser);

// Ruta para obtener los eventos a los que un usuario ha confirmado asistencia
router.get('/events/confirmed', authentication, eventsController.getEventsUserConfirmed);

// Ruta para obtener los eventos a los que un usuario ha sido invitado
router.get('/events/invited', authentication, eventsController.getEventsUserInvited);

// Ruta para obtener los eventos futuros
router.get('/events/future', authentication, eventsController.getFutureEvents);

// Ruta para obtener los eventos pasados
router.get('/events/past', authentication, eventsController.getPastEvents);

// Ruta para añadir una reseña a un evento
router.put('/events/:id/review', authentication, eventsController.addEventReview);

// Ruta para añadir un comentario a un evento
router.put('/events/:id/comment', authentication, eventsController.addEventComment);

module.exports = router;
