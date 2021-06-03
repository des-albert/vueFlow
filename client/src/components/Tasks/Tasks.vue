<template>
  <v-container>
    <v-simple-table fixed-header id="tasks">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Title</th>
            <th class="text-left">Description</th>
            <th class="text-left">Assignee</th>
            <th class="text-left">Status</th>
            <th class="text-left">Due Date</th>
            <th class="text-left">Priority</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="task in tasks" :key="task._id">
            <td class="text-left">{{ task.title }}</td>
            <td class="text-left">{{ task.description }}</td>
            <td class="text-left">{{ task.assignee }}</td>
            <td class="text-left">{{ task.status }}</td>
            <td class="text-left">{{ getTimeFromNow(task.dueDate) }}</td>
            <td class="text-left">{{ task.priority }}</td>
            <td>
              <v-btn color="button" @click.native="goToTask(task._id)">
                Edit
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'Tasks',

  created() {
    this.handleGetTasks();
  },

  computed: {
    ...mapGetters(['user', 'loading', 'tasks'])
  },

  methods: {
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    goToTask(taskId) {
      this.$router.push(`/task/${taskId}`);
    },
    handleGetTasks() {
      const userRole = localStorage.getItem('role');
      const fullname = localStorage.getItem('fullname');

      switch (userRole) {
        case 'Manager': {
          this.$store.dispatch('getAllTasks');
          return;
        }

        case 'Requester': {
          this.$store.dispatch('getRequestTasks', {
            fullname: fullname
          });
          return;
        }

        case 'Assignee': {
          this.$store.dispatch('getAssignTasks', {
            fullname: fullname
          });

          return;
        }
      }
    }
  }
};
</script>

<style scoped>
#tasks th {
  background-color: #d5aca9;
}
#tasks tr:nth-child(even) {
  background-color: #eadbe6;
}
#tasks tr:nth-child(odd) {
  background-color: #a2c7e5;
}
</style>
