# Strapi Cloudinary Media Library Plugin

A Strapi plugin that adds a **custom field** for selecting Cloudinary media assets using Cloudinary's official Media Library widget.

## 📦 Installation

Install the package from your app root directory

with `npm`

```
npm install strapi-cloudinary-media-library --save
```

or `yarn`

```
yarn add strapi-cloudinary-media-library
```

## 🔐 Getting Cloudinary Credentials

To retrieve your Cloudinary credentials:

 - Go to https://cloudinary.com/console
 - Select **Settings** > **API keys** 
 - Copy your cloud name and API key.

You don’t need the API secret for this integration — only cloud name and API key.

### ⚙️ Setting up Configuration File

Your plugin settings should go in `config/plugins.ts`. Here’s an example:

```ts
export default {
  'strapi-cloudinary-media-library': {
    enabled: true,
    config: {
      cloud_name: 'your-cloud-name',
      api_key: 'your-api-key',
    },
  },
};
```

Additionaly you can set up plugin config through Settings page in the Admin panel. Please note that this configuration will overwrite `config/plugin.ts`

![alt text](image.png)

These options are passed directly to the Cloudinary Media Library widget.