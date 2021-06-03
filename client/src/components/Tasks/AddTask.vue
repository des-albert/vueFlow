<template>
  <v-container>
    <!--   Create Task Title -->

    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card color="signInForm">
          <v-card-text>
            <h1 class="text-center">Create Task</h1>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!--    Add Task Form -->

    <v-form @submit.prevent="handleAddTask" v-model="isFormValid" lazy-validation ref="form">
      <v-row justify="center">
        <v-col cols="12" lg="8">
          <v-text-field :rules="titleRules" v-model="title" label="Title" type="text" required />
        </v-col>
      </v-row>

      <!--  Description Text Area -->

      <v-row justify="center">
        <v-col cols="12" lg="8">
          <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required filled />
        </v-col>
      </v-row>

      <!--  Priority -->

      <v-row justify="center">
        <v-col cols="8" lg="6">
          <v-select :items="priorities" filled label="Priority" v-model="priority" :rules="priorityRules" prepend-icon="format_line_spacing"> </v-select>
        </v-col>
      </v-row>

      <!--  Due Date -->

      <v-row justify="center">
        <v-col cols="6" lg="8">
          <v-card color="signInForm">
            <v-card-text>
              <h2 class="text-center">Select Due Date</h2>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-date-picker header-color="calendar" v-model="dueDate" :show-current="true" :min="minDate" prepend-icon="event"> </v-date-picker>
      </v-row>

      <v-row justify="space-around">
        <v-btn :loading="loading" :disabed="!isFormValid || loading" color="button" type="submit" class="mt-3">
          <span slot="loader" class="custom-loader">
            <v-icon color="button">mdi-reload</v-icon>
          </span>
          Submit
        </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
export default {
  name: 'AddTask',

  data() {
    return {
      dialogOpen: false,
      isFormValid: true,
      title: '',
      description: '',
      priority: '',
      dueDate: new Date().toISOString().substr(0, 10),
      titleRules: [title => !!title || 'Title is required', title => title.length < 20 || 'Title must have less than 20 characters'],
      descRules: [desc => !!desc || 'Description is required', desc => desc.length < 200 || 'Description must have less than 200 characters'],
      priorityRules: [priority => !!priority || 'Priority is required'],
      priorities: ['top', 'medium', 'low']
    };
  },
  computed: {
    minDate() {
      return moment().format();
    },
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    handleAddTask() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addTask', {
          title: this.title,
          description: this.description,
          status: 'created',
          requester: this.user.fullname,
          assignee: 'unassigned',
          dueDate: this.dueDate,
          priority: this.priority
        });
        this.$router.push('/tasks');
      }
    }
  }
};
</script>
