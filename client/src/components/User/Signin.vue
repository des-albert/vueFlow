<template>
  <v-container>
    <!--     Signin Title -->

    <v-row class="mt-3 mb-3" justify="center">
      <v-card color="signInForm" dark>
        <v-card-text>
          <h1 class="text-md-center">Welcome back to vueFlow</h1>
        </v-card-text>
      </v-card>
    </v-row>

    <!--     Error Alert -->

    <v-row v-if="error" justify="center">
      <form-alert :message="error.message" />
    </v-row>
    <!--    Signin Form -->

    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card color="signInForm" dark>
          <v-form @submit.prevent="handleSigninUser" v-model="isFormValid" lazy-validation ref="form">
            <!-- Form lines -->

            <v-row class="ml-1 mr-3">
              <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required />
            </v-row>
            <v-row class="ml-1 mr-3">
              <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required />
            </v-row>
            <v-row class="pa-3" justify="center">
              <v-btn :loading="loading" :disabed="!isFormValid || loading" color="button" type="submit">
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
                Sign-in
              </v-btn>
            </v-row>
            <v-row class="pa-3" justify="center">
              <h3>
                Don't have an account ?
                <router-link to="/signup">Sign-up</router-link>
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
  name: 'Signin',

  data() {
    return {
      isFormValid: true,
      password: '',
      passwordRules: [password => !!password || 'Password is required', password => password.length >= 4 || 'Username must be at least 4 characters'],
      username: '',
      usernameRules: [username => !!username || 'Username is required', username => username.length < 10 || 'Username must be less than 10 characters']
    };
  },

  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },

  watch: {
    user(value) {
      // if user changes redirect to home page

      if (value) {
        this.$router.push('/tasks');
      }
    }
  },
  methods: {
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signinUser', {
          username: this.username,
          password: this.password
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
