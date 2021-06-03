import { gql } from 'apollo-boost';

/* Task Queries */

export const GET_TASK = gql`
  query($taskId: ID!) {
    getTask(taskId: $taskId) {
      _id
      title
      description
      status
      requester
      assignee
      updates {
        _id
        commentBody
        commentDate
        commentUser {
          _id
          username
          avatar
        }
      }
      dueDate
      priority
    }
  }
`;

export const GET_ALL_TASKS = gql`
  query {
    getAllTasks {
      _id
      title
      description
      status
      requester
      assignee
      dueDate
      priority
    }
  }
`;

export const GET_REQUEST_TASKS = gql`
  query($fullname: String!) {
    getRequestTasks(fullname: $fullname) {
      _id
      title
      description
      status
      requester
      assignee
      dueDate
      priority
    }
  }
`;

export const GET_ASSIGN_TASKS = gql`
  query($fullname: String!) {
    getAssignTasks(fullname: $fullname) {
      _id
      title
      description
      status
      requester
      assignee
      dueDate
      priority
    }
  }
`;

export const SEARCH_ALL_TASKS = gql`
  query($searchTerm: String) {
    searchAllTasks(searchTerm: $searchTerm) {
      _id
      title
      description
    }
  }
`;

export const SEARCH_ASSIGN_TASKS = gql`
  query($searchTerm: String, $fullname: String!) {
    searchAssignTasks(searchTerm: $searchTerm, fullname: $fullname) {
      _id
      title
      description
    }
  }
`;

export const SEARCH_REQUEST_TASKS = gql`
  query($searchTerm: String, $fullname: String!) {
    searchRequestTasks(searchTerm: $searchTerm, fullname: $fullname) {
      _id
      title
      description
    }
  }
`;

/* User Queries  */

export const GET_ASSIGNEES = gql`
  query {
    getAssignees
  }
`;

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      fullname
      password
      avatar
      role
    }
  }
`;

/* Task Mutations */

export const ASSIGN_TASK = gql`
  mutation($taskId: ID!, $fullname: String!) {
    assignTask(taskId: $taskId, fullname: $fullname) {
      _id
      title
      assignee
    }
  }
`;
export const CHANGE_STATUS = gql`
  mutation($taskId: ID!, $status: String!) {
    changeStatus(taskId: $taskId, status: $status) {
      _id
      title
      status
    }
  }
`;

export const ADD_TASK = gql`
  mutation($title: String!, $description: String!, $status: String!, $requester: String!, $assignee: String!, $dueDate: Date!, $priority: String!) {
    addTask(title: $title, description: $description, status: $status, requester: $requester, assignee: $assignee, dueDate: $dueDate, priority: $priority) {
      title
      description
      status
      requester
      assignee
      dueDate
      priority
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation($commentBody: String!, $userId: ID!, $taskId: ID!) {
    addTaskComment(commentBody: $commentBody, userId: $userId, taskId: $taskId) {
      _id
      commentBody
      commentDate
      commentUser {
        _id
        username
        avatar
      }
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $fullname: String!, $password: String!, $role: String!) {
    signupUser(username: $username, email: $email, fullname: $fullname, password: $password, role: $role) {
      token
    }
  }
`;
