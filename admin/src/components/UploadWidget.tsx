import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@strapi/design-system';

import { getTranslation } from '../utils/getTranslation';
import type { CloudinaryUploadData } from '../types';
import { useSettingsAPI } from '../hooks/useSettingsApi';
import { useScript } from '../hooks/useScript';
import { useNotification } from '@strapi/strapi/admin';

type UploadWidgetProps = {
  onSelect: (result: CloudinaryUploadData) => void;
};

const UploadWidget = ({ onSelect }: UploadWidgetProps) => {
  const { formatMessage } = useIntl();
  const myLibrary = useRef<any>(null);

  const cloudinaryScriptStatus = useScript('https://media-library.cloudinary.com/global/all.js');

  const { config } = useSettingsAPI();

  const { toggleNotification } = useNotification();

  useEffect(() => {
    if (myLibrary.current || (config.status !== 'success' && cloudinaryScriptStatus !== 'ready')) {
      return;
    }

    if (!config.data) {
      console.warn('Cloudinary config data is not available');
      return;
    }

    const { cloudName, apiKey } = config.data;

    if (!cloudName || !apiKey) {
      console.warn('Cloudinary cloudName or apiKey is missing');
      return;
    }

    // RENDER AS MODAL (ATTENTION: this works, mediaLibrary's case not)
    try {
      myLibrary.current = (window as any).cloudinary.createMediaLibrary(
        {
          cloud_name: cloudName,
          api_key: apiKey,
          insert_caption: formatMessage({ id: getTranslation('select.label') }),
          remove_header: false,
        },
        {
          insertHandler: (data: CloudinaryUploadData) => {
            console.log('Asset selected:', data);
            onSelect(data);
          },
        }
      );
    } catch (err) {
      console.warn('Error while loading Cloudinary Media Library', err);
    }
    myLibrary.current.on('close', () => {
      console.log('MODAL modalView closed');
    });
  }, [config, cloudinaryScriptStatus, myLibrary]);

  const onOpenAgain = () => {
    try {
      myLibrary.current.show();
    } catch (err) {
      if (!config.data?.cloudName || !config.data?.apiKey) {
        toggleNotification({
          message: formatMessage({
            id: getTranslation('config.error'),
          }),
          type: 'danger',
        });
      } else {
        toggleNotification({
          message:
            formatMessage({
              id: getTranslation('modal.error'),
            }) + err,
          type: 'danger',
        });
      }
    }
  };

  return (
    <Button
      loading={cloudinaryScriptStatus === 'loading'}
      disabled={cloudinaryScriptStatus === 'error' && !!config.error}
      onClick={onOpenAgain}
    >
      {formatMessage({ id: getTranslation('upload.label') })}
    </Button>
  );
};

export default UploadWidget;
