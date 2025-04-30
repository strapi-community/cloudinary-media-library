import type { Core } from '@strapi/strapi';
import { setupPermissions } from './permissions';

const bootstrap = async(context: { strapi: Core.Strapi }) => {
  await setupPermissions(context);
};

export default bootstrap;
