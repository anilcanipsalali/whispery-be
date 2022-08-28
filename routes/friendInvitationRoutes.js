const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const auth = require('../service/auth');
const friendInvitationController = require('../controllers/friendInvitation/friendInvitationController');

const postFriendInvitationSchema = Joi.object({
    targetUsername: Joi.string(),
});

const inviteDecisionSchema = Joi.object({
    id: Joi.string().required(),
});

router.post(
    '/invite', 
    auth, 
    validator.body(postFriendInvitationSchema), 
    friendInvitationController.controllers.postInvite
);

router.post(
    "/accept",
    auth,
    validator.body(inviteDecisionSchema),
    friendInvitationController.controllers.postAccept
);
  
router.post(
    "/reject",
    auth,
    validator.body(inviteDecisionSchema),
    friendInvitationController.controllers.postReject
);

module.exports = router;