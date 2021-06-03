import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        horizAppBar: '#82a3a1',
        sideNavBackground: '#bdb6ac',
        signInForm: '#d5aca9',
        commentText: '#3427ac',
        commentCard: '#dfdebe',
        button: '#9693bd',
        taskCard: '#ffeac7',
        alert: '#b15573',
        calendar: '#e3b5a4',
        profileCard: '#d5aca9'
      }
    }
  }
});
