export default [
    {
      path: '/CallApp',
      name: 'CallApp',
      component: () => import('@/views/transfer/CallApp.vue'),
      meta: {
        keepAlive: true,
      },
    },
  ];
  