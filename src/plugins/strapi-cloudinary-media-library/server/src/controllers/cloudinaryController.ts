import type { Core } from '@strapi/strapi';

const cloudinaryController = ({ strapi }: { strapi: Core.Strapi }) => ({
  getConfig(ctx) {
    const config = strapi.config.get('plugin.strapi-cloudinary-media-library');
    ctx.send(config);
  },
});

export default cloudinaryController;