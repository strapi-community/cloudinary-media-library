import { Core } from '@strapi/strapi';
import { decryptConfig, encryptConfig } from '../utils';
import { Config } from '../schemas';

const settingsController = ({ strapi }: { strapi: Core.Strapi }) => ({

  getEncryptionKey() {
    const { encryptionKey } = strapi.config.get<Config>('plugin.strapi-cloudinary-media-library');
    return encryptionKey;
  },

  async getConfig(ctx) {
    const settings = await strapi
      .store({
        type: 'plugin',
        name: 'strapi-cloudinary-media-library',
      })
      .get({ key: 'cloudinary-config' })
      .then((data) => decryptConfig(data, this.getEncryptionKey()));

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
        value: encryptConfig(ctx.request.body, this.getEncryptionKey()),
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
        value: encryptConfig(defaultConfig, this.getEncryptionKey()),
      });

    ctx.send(updated);
  },
});

export default settingsController;
