<template>
  <v-container>
    <v-card color="signInForm">
      <v-card-text>
        <h1 class="text-md-center">vueFlow</h1>
      </v-card-text>
      <v-card-text>
        <h2 class="text-md-center">Version 2.0 March 27, 2020</h2>
      </v-card-text>
      <v-card-text>
        <h2 class="text-md-center">Author: Des Albert</h2>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'About',

  data() {
    return {
      statusList: ['Created', 'Assigned', 'In Progress', 'On Hold', 'Complete', 'Closed']
    };
  }
};
</script>
