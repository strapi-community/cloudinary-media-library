import { Core } from '@strapi/strapi';
import { decryptConfig, encryptConfig } from '../utils';
import { Config } from '../schemas';

const settingsController = ({ strapi }: { strapi: Core.Strapi }) => ({

  getEncryptionKey() {
    const { encryptionKey } = strapi.config.get<Config>('plugin.cloudinary-media-library');
    return encryptionKey;
  },

  sanitizeConfig(config: Config) {
    return {
      cloudName: config.cloudName,
      apiKey: config.apiKey,
    };
  },

  async getConfig(ctx) {
    const settings = await strapi
      .store({
        type: 'plugin',
        name: 'cloudinary-media-library',
      })
      .get({ key: 'cloudinary-config' })
      .then((data) => decryptConfig(data, this.getEncryptionKey()));

    if (!settings) {
      const config = strapi.config.get<Config>('plugin.cloudinary-media-library');
      return ctx.send(this.sanitizeConfig(config) || {});
    }

    ctx.send(this.sanitizeConfig(settings) || {});
  },

  async updateConfig(ctx) {
    const updated = await strapi
      .store({
        type: 'plugin',
        name: 'cloudinary-media-library',
      })
      .set({
        key: 'cloudinary-config',
        value: encryptConfig(ctx.request.body, this.getEncryptionKey()),
      });

    ctx.send(updated);
  },

  async restoreConfig(ctx) {
    const defaultConfig = strapi.config.get('plugin.cloudinary-media-library');

    const updated = await strapi
      .store({
        type: 'plugin',
        name: 'cloudinary-media-library',
      })
      .set({
        key: 'cloudinary-config',
        value: encryptConfig(defaultConfig, this.getEncryptionKey()),
      });

    ctx.send(updated);
  },
});

export default settingsController;
