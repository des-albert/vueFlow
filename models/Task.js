const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true
  },
  requester: {
    type: String,
    required: true
  },
  assignee: {
    type: String
  },
  updates: [
    {
      commentBody: {
        type: String,
        required: true
      },
      commentDate: {
        type: Date,
        default: Date.now
      },
      commentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ],
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    required: true
  }
});

// Create index to search for all fields of posts

TaskSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model('Task', TaskSchema);
