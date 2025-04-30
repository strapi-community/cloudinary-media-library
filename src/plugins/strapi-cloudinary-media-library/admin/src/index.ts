import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: "cloudinary",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: getTranslation('cloudinary.label'),
        defaultMessage: "Cloudinary",
      },
      intlDescription: {
        id: getTranslation('cloudinary.description'),
        defaultMessage: "Select a file",
      },
      components: {
        Input: async () => import('./components/Input'),
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
