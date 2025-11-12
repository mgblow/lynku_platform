import { emitter } from './../utils/event-bus'
import { createRouter, createWebHashHistory } from 'vue-router'
import Box from '../views/Box.vue'
import Profile from '../views/Profile.vue'
import Publish from '../views/Publish.vue'
import Login from '../views/Login.vue'
import Others from '../views/Others.vue'
import Mail from '../views/Mail.vue'
import Chat from '../views/Chat.vue'
import Feed from '../views/Feed.vue'
import Tweet from '../views/Tweet.vue'
import AvatarGenerator from '../views/AvatarGenerator.vue'
import Born from '@/views/Born.vue'

const history = createWebHashHistory()
const routes = [
    {
        path: '/mail',
        name: 'Mail',
        component: Mail,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/avatar',
        name: 'AvatarGenerator',
        component: AvatarGenerator,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/chat/:id',
        name: 'Chat',
        component: Chat,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/others',
        name: 'Others',
        component: Others,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/topic',
        name: 'Feed',
        component: Feed,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/publish',
        name: 'Publish',
        component: Publish,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/post/:id',
        name: 'Tweet',
        component: Tweet,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/boxes',
        name: 'Boxes',
        component: Box,
        meta: {
            layout: 'default'
        }
    },
  {
    path: '/born',
    name: 'Born',
    component: Born,
    meta: {
      layout: 'default'
    }
  }
    ,
    {
        path: '/',
        name: 'Globe',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Globe.vue'),
        meta: {
            layout: 'default'
        }
    },
  {
    path: '/live',
    name: 'LivePingGlobe',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Universe.vue'),
    meta: {
      layout: 'default'
    }
  },
    {
        path: '/logout',
        name: 'Logout',
        // No component needed as we're just redirecting after logic
        beforeEnter: (to, from, next) => {
            console.log('Logging out...');
            // 1. Clear Local Storage
            localStorage.clear();
            // 2. Clear Session Storage
            sessionStorage.clear();
            // 3. Clear Cookies (You may need a utility function for all cookies)
            // Example of clearing a single cookie named 'auth_token':
            // document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // To clear all path-dependent cookies, you might need a more comprehensive solution 
            // or iterate over known cookie names. For a basic setup, you can clear all:
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
            });
            emitter.emit('refresh-navigation-state');
            // 4. Navigate to the root (Feed)
            next({ name: 'Feed', replace: true });
        },
        meta: {
            layout: 'default'
        }
    },


]
const router = createRouter({
    linkActiveClass: 'active',
    history,
    routes
})

export { router }
