import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@strapi/design-system';

import useScript from 'react-script-hook';
import { getTranslation } from '../utils/getTranslation';
import type { CloudinaryUploadData } from '../types';
import { useSettingsAPI } from '../hooks/useSettingsApi';

type UploadWidgetProps = {
  onSelect: (result: CloudinaryUploadData) => void;
};

const UploadWidget = ({ onSelect }: UploadWidgetProps) => {
  const { formatMessage } = useIntl();
  const myLibrary = useRef<any>(null);

  const [loading] = useScript({
    src: 'https://media-library.cloudinary.com/global/all.js',
    checkForExisting: true,
  });

  const { config } = useSettingsAPI();

  useEffect(() => {
    if (loading || myLibrary.current || config.status !== 'success') {
      return;
    }

    const { cloud_name, api_key } = config.data;

    // RENDER AS MODAL (ATTENTION: this works, mediaLibrary's case not)
    myLibrary.current = (window as any).cloudinary.createMediaLibrary(
      {
        cloud_name,
        api_key,
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

    myLibrary.current.on('close', () => {
      console.log('MODAL modalView closed');
    });
  }, [config, loading, myLibrary]);

  const onOpenAgain = () => {
    myLibrary.current.show();
  };

  return (
    <Button onClick={onOpenAgain}>{formatMessage({ id: getTranslation('upload.label') })}</Button>
  );
};

export default UploadWidget;
