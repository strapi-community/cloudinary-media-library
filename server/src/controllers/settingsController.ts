import { Core } from '@strapi/strapi';
import { decryptConfig, encryptConfig } from '../utils';
import { Config } from '../schemas';

const PLUGIN_URL = 'plugin::cloudinary-media-library';

const settingsController = ({ strapi }: { strapi: Core.Strapi }) => ({
  getEncryptionKey() {
    const { encryptionKey } = strapi.config.get<Config>(PLUGIN_URL);
    return encryptionKey;
  },

  sanitizeConfig(config: Config | null | undefined) {
    if (!config) {
      return {};
    }
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
      const config = strapi.config.get<Config>(PLUGIN_URL);
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
    const defaultConfig = strapi.config.get(PLUGIN_URL);

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
