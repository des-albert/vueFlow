import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

import AddTask from '../components/Tasks/AddTask.vue';
import Task from '../components/Tasks/Task.vue';
import Tasks from '../components/Tasks/Tasks.vue';

import Profile from '../components/User/Profile.vue';
import Signin from '../components/User/Signin.vue';
import Signup from '../components/User/Signup.vue';

import Colors from '../components/Shared/Colors.vue';

import AuthGuard from '../AuthGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/addTask',
    name: 'AddTask',
    component: AddTask,
    beforeEnter: AuthGuard
  },
  {
    path: '/task/:taskId',
    name: 'Task',
    component: Task,
    props: true
  },

  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: AuthGuard
  },

  {
    path: '/signin',
    name: 'Signin',
    component: Signin
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks
  },
  {
    path: '/colors',
    name: 'Colors',
    component: Colors
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
