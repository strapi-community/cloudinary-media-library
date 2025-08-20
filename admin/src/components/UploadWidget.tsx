import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@strapi/design-system';

import { default as RSH } from 'react-script-hook';
import { getTranslation } from '../utils/getTranslation';
import type { CloudinaryUploadData } from '../types';
import { useSettingsAPI } from '../hooks/useSettingsApi';

type UploadWidgetProps = {
  onSelect: (result: CloudinaryUploadData) => void;
};

const UploadWidget = ({ onSelect }: UploadWidgetProps) => {
  const { formatMessage } = useIntl();
  const myLibrary = useRef<any>(null);

  const useScript = (RSH as any).default;

  const [loading] = useScript({
    src: 'https://media-library.cloudinary.com/global/all.js',
    checkForExisting: true,
  })

  const { config } = useSettingsAPI();

  useEffect(() => {
    if (loading || myLibrary.current || config.status !== 'success') {
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
      console.warn('Error while loading Cloudinary Media Library', err)
    }
    myLibrary.current.on('close', () => {
      console.log('MODAL modalView closed');
    });
  }, [config, loading, myLibrary]);

  const onOpenAgain = () => {
    myLibrary.current.show();
  };

  return (
    <Button 
      loading={loading} 
      disabled={!!config.error} 
      onClick={onOpenAgain}
    >
      {formatMessage({ id: getTranslation('upload.label') })}
    </Button>
  );
};

export default UploadWidget;
