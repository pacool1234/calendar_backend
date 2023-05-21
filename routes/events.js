const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/EventController');
const { uploadEventImg } = require('../middlewares/upload');
const { authentication } = require('../middlewares/authentication');


router.get('/', authentication, eventsController.getEvents);
router.get('/:id', authentication, eventsController.getEventById);
router.get('/confirmed', authentication, eventsController.getEventsUserConfirmed);
router.get('/invited', authentication, eventsController.getEventsUserInvited);
router.get('/future', authentication, eventsController.getFutureEvents);
router.get('/past', authentication, eventsController.getPastEvents);
router.post('/', authentication, uploadEventImg.single('image'), eventsController.createEvent);
router.put('/:id', authentication, uploadEventImg.single('image'), eventsController.updateEvent);
router.put('/:id/comment', authentication, eventsController.addEventComment);
router.put('/:id/confirm', authentication, eventsController.confirmAttendance);
router.put('/:id/cancel', authentication, eventsController.cancelAttendance);
router.put('/:id/invite', authentication, eventsController.inviteUser);
router.put('/:id/uninvite', authentication, eventsController.uninviteUser);
router.put('/:id/review', authentication, eventsController.addEventReview);
router.delete('/:id', authentication, eventsController.deleteEvent);

module.exports = router;
