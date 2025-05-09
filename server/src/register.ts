import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'cloudinary',
    plugin: 'cloudinary-media-library',
    type: 'string',
  });
};

export default register;
