'use strict';

import { Core } from '@strapi/strapi';

export const permissions = {
  render: function (uid: string) {
    return `plugin::strapi-cloudinary-media-library.${uid}`;
  },
  cloudinary: {
    settings: 'settings',
  },
};

export const setupPermissions = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Cloudinary',
      uid: permissions.cloudinary.settings,
      pluginName: 'strapi-cloudinary-media-library',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};

export default permissions;
