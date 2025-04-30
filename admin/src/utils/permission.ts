'use strict';

import { PLUGIN_ID } from "../pluginId";

const render = (uid: string) => {
  return `plugin::${PLUGIN_ID}.${uid}`;
};

const cloudinary = {
  settings: 'settings',
};

// This should be equal to admin side. Strapi push to make admin and server independent chunks. 
const pluginPermissions = {
  settings: [{ action: render(cloudinary.settings), subject: null }],
};

export default pluginPermissions;
