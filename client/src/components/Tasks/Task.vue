<template>
  <v-container v-if="getTask">
    <v-card color="taskCard" hover>
      <v-card-text>
        <v-row justify="center">
          <v-col>
            <span class="card-text-bold"> Title: </span><span class="card-text"> {{ getTask.title }}</span>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <span class="card-text-bold"> Description: </span><span class="card-text"> {{ getTask.description }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="card-text-bold">Requester: </span>
            <span class="card-text"> {{ getTask.requester }}</span>
          </v-col>
          <v-col>
            <span class="card-text-bold">Priority: </span>
            <span class="card-text"> {{ getTask.priority }}</span>
          </v-col>
          <v-col>
            <span class="card-text-bold">Due Date: </span>
            <span class="card-text"> {{ getTimeFromNow(getTask.dueDate) }}</span>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row justify="center">
          <v-col>
            <span class="card-text-bold">Assignee: </span>
            <span class="card-text"> {{ getTask.assignee }}</span>
          </v-col>
          <v-col>
            <v-dialog v-model="dialogOpen" scrollable width="400px" :disabled="requester">
              <template v-slot:activator="{ on }">
                <v-btn small color="button" dark v-on="on">
                  Reassign
                </v-btn>
              </template>
              <v-card color="commentCard">
                <v-card-text>
                  <v-select :items="assignees" label="Select Assignee" v-model="assignee" background-color="commentCard" prepend-icon="group" />
                </v-card-text>
                <v-card-actions>
                  <v-btn color="button" dark small @click.native="dialogOpen = false">Close </v-btn>
                  <v-btn color="button" dark small @click.native="handleAssignTask">Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>

        <!-- Status  -->
        <v-row>
          <v-col>
            <span class="card-text-bold">Status: </span><span class="card-text"> {{ getTask.status }}</span>
          </v-col>
          <v-col>
            <v-dialog v-model="statusOpen" scrollable width="400px">
              <template v-slot:activator="{ on }">
                <v-btn small color="button" dark v-on="on">Update</v-btn>
              </template>
              <v-card color="commentCard">
                <v-card-text>
                  <v-select :items="statusList" label="Select Status" v-model="status" background-color="commentCard" prepend-icon="group" />
                </v-card-text>
                <v-card-actions>
                  <v-btn color="button" text @click.native="statusOpen = false">Close</v-btn>
                  <v-btn color="button" text @click.native="handleTaskStatus">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Message Input  -->

    <div v-if="user" class="mt-3 mr-3">
      <v-row justify="center">
        <v-col cols="12">
          <v-form color="commentCard" v-model="isFormValid" lazy-validation @submit.prevent="handleAddComment" ref="form">
            <v-textarea v-model="commentBody" dense filled clearable auto-grow :append-outer-icon="commentBody && 'send'" label="Add comment" type="text" @click:append-outer="handleAddComment" prepend-icon="playlist_add" required>
            </v-textarea>
          </v-form>
        </v-col>
      </v-row>
    </div>

    <!-- Messages -->

    <v-row justify="center">
      <v-col cols="12">
        <v-list subheader two-line color="commentCard">
          <v-subheader>({{ getTask.updates.length }}) Comments </v-subheader>
          <template v-for="comment in getTask.updates">
            <v-divider :key="comment._id"> </v-divider>
            <v-list-item avator inset :key="comment.title">
              <v-list-item-avatar>
                <img :src="comment.commentUser.avatar" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title> {{ comment.commentBody }} </v-list-item-title>
                <v-list-item-subtitle>
                  {{ comment.commentUser.username }} -
                  <span class="hidden-xs-only">{{ getTimeFromNow(comment.commentDate) }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="hidden-xs-only">
                <v-icon :color="checkIfOwnComment(comment) ? 'accent' : 'grey'">chat_bubble</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { GET_TASK, ADD_TASK_COMMENT } from '../../queries';

export default {
  name: 'Task',
  props: ['taskId'],

  data() {
    return {
      dialogOpen: false,
      statusOpen: false,
      assignee: '',
      requester: false,
      commentBody: '',
      isFormValid: true,
      statusList: ['created', 'assigned', 'in progress', 'on hold', 'complete', 'archive'],
      status: '',
      commentRules: [comment => !!comment || 'Comment is required', comment => (comment && comment.length < 80) || 'Comment must be less than 80 characters']
    };
  },

  apollo: {
    getTask: {
      query: GET_TASK,
      variables() {
        return {
          taskId: this.taskId
        };
      }
    }
  },
  created() {
    this.requester = localStorage.getItem('role') == 'Requester' ? true : false;
  },
  computed: {
    ...mapGetters(['user', 'assignees'])
  },
  methods: {
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    checkIfOwnComment(comment) {
      return this.user && this.user._id === comment.commentUser._id;
    },
    handleTaskStatus() {
      this.statusOpen = false;
      this.$store.dispatch('changeStatus', {
        taskId: this.taskId,
        status: this.status
      });
    },
    handleAssignTask() {
      this.dialogOpen = false;
      this.$store.dispatch('assignTask', {
        taskId: this.taskId,
        fullname: this.assignee
      });

      if (this.user.role === 'Manager') {
        this.$store.dispatch('changeStatus', {
          taskId: this.taskId,
          status: 'Assigned'
        });
      }
    },
    handleAddComment() {
      if (this.$refs.form.validate()) {
        const variables = {
          commentBody: this.commentBody,
          userId: this.user._id,
          taskId: this.taskId
        };

        this.$apollo
          .mutate({
            mutation: ADD_TASK_COMMENT,
            variables,
            update: (cache, { data: { addTaskComment } }) => {
              const data = cache.readQuery({
                query: GET_TASK,
                variables: { taskId: this.taskId }
              });

              data.getTask.updates.unshift(addTaskComment);

              cache.writeQuery({
                query: GET_TASK,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(() => {
            this.$refs.form.reset();
          })
          .catch(err => console.error(err));
      }
    }
  }
};
</script>

<style>
.card-text-bold {
  color: #82a3a1;
  font-size: 20px;
  font-weight: bold;
}

.card-text {
  color: #8f6663;
  font-size: 20px;
}
</style>
