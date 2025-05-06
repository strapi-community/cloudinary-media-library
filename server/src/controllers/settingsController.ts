import { Core } from '@strapi/strapi';

const settingsController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getConfig(ctx) {
    const settings = await strapi
      .store({
        type: 'plugin',
        name: 'strapi-cloudinary-media-library',
      })
      .get({ key: 'cloudinary-config' });

    if (!settings) {
      const config = strapi.config.get('plugin.strapi-cloudinary-media-library');
      return ctx.send(config || {});
    }

    ctx.send(settings || {});
  },

  async updateConfig(ctx) {
    const updated = await strapi
      .store({
        type: 'plugin',
        name: 'strapi-cloudinary-media-library',
      })
      .set({
        key: 'cloudinary-config',
        value: ctx.request.body,
      });

    ctx.send(updated);
  },

  async restoreConfig(ctx) {
    const defaultConfig = strapi.config.get('plugin.strapi-cloudinary-media-library');

    const updated = await strapi
      .store({
        type: 'plugin',
        name: 'strapi-cloudinary-media-library',
      })
      .set({
        key: 'cloudinary-config',
        value: defaultConfig,
      });

    ctx.send(updated);
  },
});

export default settingsController;
