import { Core } from '@strapi/strapi';
import settingsController from '../settingsController';
import { decryptConfig, encryptConfig } from '../../utils';

jest.mock('../../utils', () => ({
  decryptConfig: jest.fn(),
  encryptConfig: jest.fn(),
}));

describe('Settings Controller', () => {
  let strapi: any;
  let controller: any;
  let ctx: any;

  beforeEach(() => {
    strapi = {
      config: {
        get: jest.fn(),
      },
      store: jest.fn().mockReturnValue({
        get: jest.fn(),
        set: jest.fn(),
      }),
    };

    ctx = {
      send: jest.fn(),
      request: {
        body: {},
      },
    };

    controller = settingsController({ strapi });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfig', () => {
    it('should return decrypted config from store if exists', async () => {
      const mockConfig = { cloudName: 'test-cloud', apiKey: 'test-key' };
      const mockDecryptedConfig = { cloudName: 'test-cloud', apiKey: 'test-key' };

      strapi.config.get.mockReturnValue({ encryptionKey: 'test-encryption-key' });
      strapi.store().get.mockResolvedValue(mockConfig);
      (decryptConfig as jest.Mock).mockReturnValue(mockDecryptedConfig);

      await controller.getConfig(ctx);

      expect(strapi.store).toHaveBeenCalledWith({
        type: 'plugin',
        name: 'cloudinary-media-library',
      });
      expect(decryptConfig).toHaveBeenCalledWith(mockConfig, expect.any(String));
      expect(ctx.send).toHaveBeenCalledWith(mockDecryptedConfig);
    });
  });

  describe('updateConfig', () => {
    it('should encrypt and save new config', async () => {
      const newConfig = { cloudName: 'new-cloud', apiKey: 'new-key' };
      const encryptedConfig = { encrypted: true };
      ctx.request.body = newConfig;

      strapi.config.get.mockReturnValue({ encryptionKey: 'test-encryption-key' });
      (encryptConfig as jest.Mock).mockReturnValue(encryptedConfig);
      strapi.store().set.mockResolvedValue(encryptedConfig);

      await controller.updateConfig(ctx);

      expect(encryptConfig).toHaveBeenCalledWith(newConfig, expect.any(String));
      expect(strapi.store().set).toHaveBeenCalledWith({
        key: 'cloudinary-config',
        value: encryptedConfig,
      });
      expect(ctx.send).toHaveBeenCalledWith(encryptedConfig);
    });
  });

  describe('restoreConfig', () => {
    it('should restore default config', async () => {
      const defaultConfig = { cloudName: 'default-cloud', apiKey: 'default-key', encryptionKey: 'test-encryption-key' };
      const encryptedConfig = { encrypted: true };

      strapi.config.get.mockReturnValue(defaultConfig);
      (encryptConfig as jest.Mock).mockReturnValue(encryptedConfig);
      strapi.store().set.mockResolvedValue(encryptedConfig);

      await controller.restoreConfig(ctx);

      expect(strapi.config.get).toHaveBeenCalledWith('plugin.cloudinary-media-library');
      expect(encryptConfig).toHaveBeenCalledWith(defaultConfig, expect.any(String));
      expect(strapi.store().set).toHaveBeenCalledWith({
        key: 'cloudinary-config',
        value: encryptedConfig,
      });
      expect(ctx.send).toHaveBeenCalledWith(encryptedConfig);
    });
  });
});
