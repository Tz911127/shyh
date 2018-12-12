export default [{
        path: '/rotate',
        name: 'rotate',
        meta: {

        },
        component: () => import('../views/rotate.vue')
    },

    {
        path: '/pcrotate',
        name: 'pcrotate',
        meta: {

        },
        component: () => import('../views/pcrotate.vue')
    },

    {
        path: '/rotate_turn',
        name: 'rotate_turn',
        meta: {

        },
        component: () => import('../views/rotate_turn.vue')
    },
    {
        path: '/preveiwRotate',
        name: 'preveiwRotate',
        meta: {

        },
        component: () => import('../views/preveiwRotate.vue')
    }
]