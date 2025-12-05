import { createRouter, createWebHashHistory } from 'vue-router'
import Tex from '../views/Tex.vue'
import Login from '../views/Login.vue'
import Mail from '../views/Mail.vue'
import Chat from '../views/Chat.vue'
import AvatarGenerator from '../views/AvatarGenerator.vue'
import Settings from '@/views/Settings.vue'
import { emitter } from '@/utils/event-bus'

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
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/publish',
        name: 'Publish',
        component: Tex,
        meta: {
            layout: 'default'
        }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        layout: 'default'
      }
    },
    {
        path: '/',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( '../views/Home.vue'),
        meta: {
            layout: 'default'
        }
    },
    {
      path: '/match',
      name: 'Adventure',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( '../views/Match.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/globes/:pid',
      name: 'globes',
      component: () => import('../views/PersonGlobe.vue'),
      props: true,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/lynks',
      name: 'lynks',
      component: () => import('../views/Lynks.vue'),
      props: true,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/gems',
      name: 'gems',
      component: () => import('../views/Gems.vue'),
      props: true,
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/maker',
      name: 'maker',
      component: () => import('../views/GlobeMaker.vue'),
      props: true,
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
              emitter.emit("logout", true)
              emitter.emit("success-message", "با موفقیت خارج شدی. خدانگهدار!")
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
              // 4. Navigate to the root (Home)
              next({ name: 'Home', replace: true,  });
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
