<template>
  <v-container v-if="user">
    <!--    User Details  -->
    <v-row justify="space-around">
      <v-col cols="12">
        <v-card class="white--text" color="profileCard" max-width="500px">
          <v-layout justify-center>
            <v-col cols="3">
              <v-img height="50px" position="center" contain :src="user.avatar"> </v-img>
            </v-col>

            <v-col cols="9">
              <v-card-title primary-title>
                <div>
                  <v-card-text
                    ><span class="profile">Username: </span><span class="value">{{ user.username }} </span></v-card-text
                  >
                  <v-card-text
                    ><span class="profile">Full Name: </span><span class="value">{{ user.fullname }} </span></v-card-text
                  >
                  <v-card-text
                    ><span class="profile">Email: </span><span class="value">{{ user.email }}</span>
                  </v-card-text>
                  <v-card-text
                    ><span class="profile">Role: </span><span class="value">{{ user.role }}</span></v-card-text
                  >
                </div>
              </v-card-title>
            </v-col>
          </v-layout>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Profile',
  computed: {
    ...mapGetters(['user'])
  }
};
</script>
<style>
.profile {
  color: #773344;
  font-size: 20px;
  font-weight: bold;
  font-family: 'Open Sans';
}
.value {
  font-size: 20px;
  font-family: 'Open Sans';
}
</style>
