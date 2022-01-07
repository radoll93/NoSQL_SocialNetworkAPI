const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
    // update user information
    updateUser(req, res) {
      User.findOneAndUpdate({ _id: req.params.userId },
        { $set: req.body },
        {runValidators: true, new: true }
        )
        .then((user) => 
        !user
        ? res.status(404).json({ message: 'No user with the Id!'})
        : res.json(user))
        .catch((err) => res.status(500).json(err));
    },
  // Delete a user and associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // create a new friend
  createFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends : req.params.friendId } },
      { new: true }
      )
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // delete a friend
  deleteFriend(req, res) {
    User.findOneAndDelete({ _id: req.params.friendId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No friend with that ID' })
          : res.json({ message: 'Friend deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },
};
