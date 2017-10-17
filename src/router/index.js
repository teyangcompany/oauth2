import Vue from 'vue'
import Router from 'vue-router'
import {tokenCache, fromCache} from "../lib/cache"


Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            component: () => import("../pages/index.vue")
        }    ]

});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.needLogin)) {
        let token = tokenCache.get();
        if (token) {
            next();
        } else {
            fromCache.set(to.fullPath)
            next('/login');
        }
    } else {
        next();
    }
});

/*路由懒加载*/
export default router;
