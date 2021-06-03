<template>
  <v-container>
    <!--     Signup Title -->

    <v-row class="mt-3 mb-3" justify="center">
      <v-card color="signInForm" dark>
        <v-card-text>
          <h1 class="text-md-center">Sign Up</h1>
        </v-card-text>
      </v-card>
    </v-row>

    <!--     Error Alert -->

    <v-row v-if="error" justify="center">
      <form-alert :message="error.message" />
    </v-row>

    <!--    Signup Form -->

    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card color="signInForm" dark>
          <v-form @submit.prevent="handleSignupUser" v-model="isFormValid" lazy-validation ref="form">
            <v-row class="ml-1 mr-3">
              <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required />
            </v-row>
            <v-row class="ml-1 mr-3">
              <v-text-field :rules="emailRules" v-model="email" prepend-icon="email" label="Email" type="email" required />
            </v-row>
            <v-row class="ml-1 mr-3">
              <v-text-field :rules="fullnameRules" v-model="fullname" prepend-icon="face" label="Full Name" type="text" required />
            </v-row>
            <v-row class="ml-1 mr-3">
              <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required> </v-text-field>
            </v-row>
            <v-row class="ml-1 mr-3">
              <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="gavel" label="Confirm Password" type="password" required>
              </v-text-field>
            </v-row>
            <v-row class="ml-1 mr-3">
              <v-select :items="roles" filled label="Role" v-model="role" prepend-icon="group"> </v-select>
            </v-row>
            <v-row class="pa-3" justify="center">
              <v-btn :loading="loading" :disabled="!isFormValid || loading" color="button" type="submit">
                <span slot="loader" class="custom-loader"> <v-icon light>cached</v-icon></span>
                Signup
              </v-btn>
            </v-row>
            <v-row class="pa-3" justify="center">
              <h3>
                Already have an account ?
                <router-link to="/signin">Sign-in</router-link>
              </h3>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Signup',
  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      fullname: '',
      password: '',
      role: '',
      passwordConfirmation: '',
      usernameRules: [username => !!username || 'Username is required', username => username.length < 10 || 'Username must be less than 10 characters'],
      fullnameRules: [fullname => !!fullname || 'Full Name is required'],
      emailRules: [email => !!email || 'Email is required', email => /.@+./.test(email) || 'Email must be valid'],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || 'Username must be at least 4 characters',
        confirmation => confirmation === this.password || 'Passwords must match'
      ],
      roles: ['Requester', 'Manager', 'Assignee']
    };
  },

  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  watch: {
    user(value) {
      // if user changes redirect to tasks page

      if (value) {
        this.$router.push('/tasks');
      }
    }
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          fullname: this.fullname,
          password: this.password,
          role: this.role
        });
      }
    }
  }
};
</script>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
