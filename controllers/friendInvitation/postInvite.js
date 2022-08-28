const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postInvite = async (req, res) => {
    const { targetUsername } = req.body;

    const { userId, username } = req.user;

    if(username.toLowerCase() === targetUsername.toLowerCase()) {
        return res
        .status(409)
        .send('Sorry, you cannot become friend with yourself :(');
    }

    const targetUser = await User.findOne({
        username: targetUsername.toLowerCase(),
    });

    if(!targetUser) {
        return res
        .status(404)
        .send(`Friend of "${targetUsername}" has not been found. Please check username again!`);
    }

    const invitationAlreadyReceived = await FriendInvitation.findOne({
        senderId: userId,
        receiverId: targetUser._id
    });

    if (invitationAlreadyReceived) {
        return res
        .status(409)
        .send('Invitation has been already sent!');
    }

    const usersAlreadyFriends = targetUser.friends.find(
        friendId => friendId.toString() === userId.toString() 
    );

    if(usersAlreadyFriends) {
        return res
        .status(409)
        .send('Friend already added. Please check friends list!');
    }

    const newInvitation = await FriendInvitation.create({
        senderId: userId,
        receiverId: targetUser._id,
    });

    friendsUpdate.updateFriendsPendingInvitations(targetUser._id.toString());

    return res.status(201).send('Invitation has been sent!');
}

module.exports = postInvite;