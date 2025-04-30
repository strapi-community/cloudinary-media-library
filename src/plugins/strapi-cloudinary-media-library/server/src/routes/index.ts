import contentAPIRoutes from './content-api';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/config',
        handler: 'cloudinary.getConfig',
        config: {
          auth: false,
        },
      },
    ]
  }
};

export default routes;
