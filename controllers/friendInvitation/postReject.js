const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    const invitationExists = await FriendInvitation.exists({ senderId: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(invitationExists._id);
    } 

    friendsUpdates.updateFriendsPendingInvitations(userId);

    return res.status(200).send("Invitation succesfully rejected");

  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong please try again");
  }
};

module.exports = postReject;
