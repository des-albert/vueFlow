const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      });
      return user;
    },

    getAssignees: async (_, args, { User }) => {
      const users = await User.find({
        role: 'Assignee'
      });
      return users.map((a) => a.fullname);
    },

    getTask: async (_, { taskId }, { Task }) => {
      return await Task.findOne({ _id: taskId }).populate({
        path: 'updates.commentUser',
        model: 'User'
      });
    },

    getAllTasks: async (_, args, { Task }) => {
      const tasks = await Task.find({ status: { $ne: 'archive' } }).sort({ priority: 'desc' });
      return tasks;
    },

    getRequestTasks: async (_, { fullname }, { Task }) => {
      const tasks = await Task.find({ requester: fullname, status: { $ne: 'archive' } }).sort({ priority: 'desc' });
      return tasks;
    },

    getAssignTasks: async (_, { fullname }, { Task }) => {
      const tasks = await Task.find({ assignee: fullname, status: { $ne: 'archive' } }).sort({ priority: 'desc' });
      return tasks;
    },

    searchAllTasks: async (_, { searchTerm }, { Task }) => {
      if (searchTerm) {
        const searchResults = await Task.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } })
          .sort({
            score: { $meta: 'textScore' }
          })
          .limit(5);
        return searchResults;
      }
    },
    searchRequestTasks: async (_, { searchTerm, fullname }, { Task }) => {
      if (searchTerm) {
        const searchResults = await Task.find({ $text: { $search: searchTerm }, requester: fullname }, { score: { $meta: 'textScore' } })
          .sort({
            score: { $meta: 'textScore' }
          })
          .limit(5);
        return searchResults;
      }
    },
    searchAssignTasks: async (_, { searchTerm, fullname }, { Task }) => {
      if (searchTerm) {
        const searchResults = await Task.find({ $text: { $search: searchTerm }, assignee: fullname }, { score: { $meta: 'textScore' } })
          .sort({
            score: { $meta: 'textScore' }
          })
          .limit(5);
        return searchResults;
      }
    }
  },

  Mutation: {
    addTask: async (_, { title, description, status, requester, assignee, dueDate, priority }, { Task }) => {
      const newTask = await new Task({
        title,
        description,
        status,
        requester,
        assignee,
        dueDate,
        priority
      }).save();
      return newTask;
    },

    addTaskComment: async (_, { commentBody, userId, taskId }, { Task }) => {
      const newComment = {
        commentBody,
        commentUser: userId
      };

      const task = await Task.findOneAndUpdate(
        { _id: taskId },

        // push new comment onto start of updates array

        { $push: { updates: { $each: [newComment], $position: 0 } } },

        { new: true }
      ).populate({
        path: 'updates.commentUser',
        model: 'User'
      });

      return task.updates[0];
    },

    assignTask: async (_, { taskId, fullname }, { Task }) => {
      return await Task.findOneAndUpdate({ _id: taskId }, { $set: { assignee: fullname } }, { new: true });
    },

    changeStatus: async (_, { taskId, status }, { Task }) => {
      return await Task.findOneAndUpdate({ _id: taskId }, { $set: { status: status } }, { new: true });
    },

    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      return { token: createToken(user, process.env.SECRET, '1hr') };
    },

    signupUser: async (_, { username, email, fullname, password, role, theme }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        fullname,
        password,
        role
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    }
  }
};
