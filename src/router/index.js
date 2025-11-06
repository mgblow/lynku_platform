import { createRouter, createWebHashHistory } from 'vue-router'
import Box from "../views/Box.vue"
import Profile from "../views/Profile.vue";
import AddBox from "../views/AddBox.vue";
import Login from "../views/Login.vue";
import Others from "../views/Others.vue";
import Mail from "../views/Mail.vue";
import Chat from "../views/Chat.vue";
import Feed from '../views/Feed.vue';
import Tweet from '../views/Tweet.vue';
import AvatarGenerator from '../views/AvatarGenerator.vue';

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
        path: '/',
        name: 'Feed',
        component: Feed,
        meta: {
            layout: 'default'
        }
    },
    {
        path: '/tweet',
        name: 'AddBox',
        component: AddBox,
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
        path: '/map',
        name: 'Map',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Map.vue'),
        meta: {
            layout: 'default'
        }
    }
]
const router = createRouter({
    linkActiveClass: 'active',
    history,
    routes
})

export { router }
