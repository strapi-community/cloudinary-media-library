'use strict';

import { Core } from '@strapi/strapi';

export const permissions = {
  render: function (uid: string) {
    return `plugin::strapi-cloudinary-media-library.${uid}`;
  },
  cloudinary: {
    read: 'read',
    settings: 'settings',
  },
};

export const setupPermissions = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: permissions.cloudinary.read,
      pluginName: 'strapi-cloudinary-media-library',
    },
    {
      section: 'plugins',
      displayName: 'Settings',
      uid: permissions.cloudinary.settings,
      pluginName: 'strapi-cloudinary-media-library',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};

export default permissions;
