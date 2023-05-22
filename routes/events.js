const express = require('express');
const router = express.Router();
const EventsController = require('../controllers/EventController');
const { uploadEventImg } = require('../middlewares/upload');
const { authentication } = require('../middlewares/authentication');


router.get('/', authentication, EventsController.getEvents);
router.get('/:id', authentication, EventsController.getEventById);
router.get('/confirmed', authentication, EventsController.getEventsUserConfirmed);
router.get('/invited', authentication, EventsController.getEventsUserInvited);
router.get('/future', authentication, EventsController.getFutureEvents);
router.get('/past', authentication, EventsController.getPastEvents);
// router.post('/', authentication, uploadEventImg.single('image'), EventsController.createEvent);
// router.put('/:id', authentication, uploadEventImg.single('image'), EventsController.updateEvent);
router.put('/:id/comment', authentication, EventsController.addEventComment);
router.put('/:id/confirm', authentication, EventsController.confirmAttendance);
router.put('/:id/cancel', authentication, EventsController.cancelAttendance);
router.put('/:id/invite', authentication, EventsController.inviteUser);
router.put('/:id/uninvite', authentication, EventsController.uninviteUser);
router.put('/:id/review', authentication, EventsController.addEventReview);
router.delete('/:id', authentication, EventsController.deleteEvent);

module.exports = router;
