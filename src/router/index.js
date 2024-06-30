import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import FirstView from '@/views/FirstView.vue';
import SecondView from '@/views/SecondView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView,
    },
    {
      path: '/vista1',
      name: 'FirstView',
      component: FirstView,
    },
    {
      path: '/vista2',
      name: 'SecondView',
      component: SecondView,
    },
  ],
});
