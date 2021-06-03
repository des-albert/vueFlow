<template>
  <v-app>
    <!-- Side NavBar -->

    <v-navigation-drawer app temporary color="sideNavBackground" fixed v-model="sideNav">
      <v-app-bar>
        <v-app-bar-nav-icon @click="toggleSideNav" />
        vueFlow
      </v-app-bar>

      <!-- Side Navbar Links -->

      <v-list>
        <v-list-item v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal NavBar -->

    <v-app-bar app color="horizAppBar" dark>
      <v-app-bar-nav-icon @click="toggleSideNav"> </v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer">
          vueFlow
        </router-link>
      </v-toolbar-title>
      <v-spacer />

      <!-- Search Input -->

      <v-text-field v-model="searchTerm" prepend-icon="search" @input="handleSearchTasks" placeholder="Search Tasks" single-line hide-details></v-text-field>

      <!-- Search Results Card -->

      <v-card hover color="commentCard" v-if="searchResults.length" id="searchCard">
        <v-card-title>Search Results - click to select</v-card-title>
        <v-card-text v-for="result in searchResults" :key="result._id" @click="goToSearchResult(result._id)">
          <span class="card-text-bold">{{ result.title }} - </span>
          <span class="card-text">{{ formatDescription(result.description) }}</span>
        </v-card-text>
      </v-card>

      <v-spacer />

      <v-spacer />

      <!-- Horizontal Navbar Links -->

      <v-toolbar-items class="hidden-xs-only">
        <v-btn text v-if="user">User: {{ user.fullname }} </v-btn>
        <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon left class="hidden-sm-only">{{ item.icon }} </v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Profile Button -->

        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          Profile
        </v-btn>

        <!-- Signout Button -->

        <v-btn text v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Signout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- App Content -->

    <v-content>
      <v-container class="mt-3">
        <transition name="fade" mode="out-in" duration="250">
          <router-view />
        </transition>

        <!-- Auth Snackbar -->

        <v-snackbar color="success" bottom left v-model="authSnackbar" :timeout="5000">
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in</h3>
          <v-btn dark text @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->

        <v-snackbar v-if="authError" color="warning" bottom left v-model="authErrorSnackbar" :timeout="5000">
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ authError.message }}</h3>
          <v-btn dark text to="/signin">Signin</v-btn>
        </v-snackbar>

      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  data: () => {
    return {
      sideNav: false,
      searchTerm: '',
      authSnackbar: false,
      authErrorSnackbar: false
    };
  },

  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    }
  },

  computed: {
    ...mapGetters(['searchResults', 'authError', 'user']),

    horizontalNavItems() {
      let items = [
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ];
      if (this.user) {
        items = [{ icon: 'chat', title: 'Tasks', link: '/tasks' }];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ];

      if (this.user) {
        if (this.user.role == 'Requester') {
          items = [
            { icon: 'chat', title: 'Tasks', link: '/tasks' },
            { icon: 'stars', title: 'Create Task', link: '/addTask' },
            { icon: 'account_box', title: 'Profile', link: '/profile' },
            { icon: 'help_outline', title: 'About', link: '/about' }
          ];
        } else {
          items = [
            { icon: 'chat', title: 'Tasks', link: '/tasks' },
            { icon: 'account_box', title: 'Profile', link: '/profile' },
            { icon: 'help_outline', title: 'About', link: '/about' }
          ];
        }
      }
      return items;
    }
  },

  methods: {
    handleSearchTasks() {
      const userRole = localStorage.getItem('role');
      const fullname = localStorage.getItem('fullname');
      switch (userRole) {
        case 'Manager': {
          this.$store.dispatch('searchAllTasks', {
            searchTerm: this.searchTerm
          });
          return;
        }
        case 'Assignee': {
          this.$store.dispatch('searchAssignTasks', {
            searchTerm: this.searchTerm,
            fullname: fullname
          });
          return;
        }
        case 'Requester': {
          this.$store.dispatch('searchRequestTasks', {
            searchTerm: this.searchTerm,
            fullname: fullname
          });
          return;
        }
      }
    },
    goToSearchResult(resultId) {
      // clear search term

      this.searchTerm = '';

      // go to desired result

      this.$router.push(`/task/${resultId}`);

      // Clear Search Results

      this.$store.commit('clearSearchResults');
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    handleSignoutUser() {
      this.$store.dispatch('signoutUser');
    },

    toggleSideNav() {
      this.sideNav = !this.sideNav;
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.card-text-bold {
  color: #82a3a1;
  font-size: 20px;
  font-weight: bold;
}

.card-text {
  color: #8f6663;
  font-size: 20px;
}
#searchCard {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}
.bounce {
  animation: bounce 1s both;
}
.app-content {
  margin-top: 3rem;
}
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
