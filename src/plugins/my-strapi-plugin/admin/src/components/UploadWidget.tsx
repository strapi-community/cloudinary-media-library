import { useEffect, useRef, ReactNode } from 'react';
import { Button } from '@strapi/design-system';

import useScript from 'react-script-hook';

const UploadWidget = ({ children, onSelect }: { children: ReactNode, onSelect: (result: any) => void }) => {

    const myLibrary = useRef<any>(null)

    const [loading] = useScript({
      src: 'https://media-library.cloudinary.com/global/all.js',
      checkForExisting: true,
    })
  
    useEffect(() => {
      if (loading || myLibrary.current) {
        return
      }
  
      // RENDER AS MODAL (ATTENTION: this works, mediaLibrary's case not)
      myLibrary.current = (window as any).cloudinary.createMediaLibrary(
        {
          cloud_name: 'ADD_CREDENTIALS_HERE',
          api_key: 'ADD_CREDENTIALS_HERE',
          insert_caption: 'Select',
          remove_header: true,
        },
        {
          insertHandler: (data: any) => {
            console.log('Asset selected:', data)
            onSelect(data);
          },
        },
      )
  
      myLibrary.current.on('close', () => {
        console.log('MODAL modalView closed')
      })
    }, [loading, myLibrary])
  
    const onOpenAgain = () => {
      myLibrary.current.show()
    }
  
    return (
      <>
        <Button
          onClick={onOpenAgain}
        >
          Upload
        </Button>
      </>
    )

}

export default UploadWidget;