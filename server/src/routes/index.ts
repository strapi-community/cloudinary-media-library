import permissions from '../permissions';

const routes = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/settings/config',
        handler: 'settings.getConfig',
        config: {
          policies: [
            {
              name: 'admin::hasPermissions',
              config: {
                actions: [permissions.render('settings')],
              },
            },
          ],
        },
      },
      {
        method: 'PUT',
        path: '/settings/config',
        handler: 'settings.updateConfig',
        config: {
          policies: [
            {
              name: 'admin::hasPermissions',
              config: {
                actions: [permissions.render('settings')],
              },
            },
          ],
        },
      },
      {
        method: 'DELETE',
        path: '/settings/config',
        handler: 'settings.restoreConfig',
        config: {
          policies: [
            {
              name: 'admin::hasPermissions',
              config: {
                actions: [permissions.render('settings')],
              },
            },
          ],
        },
      },
    ]
  }
};

export default routes;
