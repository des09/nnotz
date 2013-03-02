var users = {};

module.exports = {

  addOrUpdate: function _addOrUpdate(user, done) {
    users[user.id] = user;
    done(null, user);
  },

  getById: function _getById(id, done) {
    done(null, users[id]);
  }

};