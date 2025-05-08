import { getFetchClient } from '@strapi/strapi/admin';
import { once } from 'lodash';
import { configSchema } from './schemas';

const URL_PREFIX = 'cloudinary-media-library';

export type ApiClient = ReturnType<typeof getApiClient>;

export const getApiClient = once((fetch: ReturnType<typeof getFetchClient>) => ({
  config: {
    getKey() {
      return [URL_PREFIX, 'config'];
    },
    async query() {
      const response = await fetch.get(`/${URL_PREFIX}/settings/config`);
      return configSchema.parseAsync(response.data);
    },
  },
  settings: {
    update(body: any) {
      return fetch.put(`/${URL_PREFIX}/settings/config`, body);
    },
    restore() {
      return fetch.del(`/${URL_PREFIX}/settings/config`);
    },
    restart() {
      return fetch.post(`/${URL_PREFIX}/settings/restart`);
    },
  },
}));
