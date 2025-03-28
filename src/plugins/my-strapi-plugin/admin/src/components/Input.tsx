import * as React from "react";

import { useIntl } from "react-intl";
import { Field, Button } from '@strapi/design-system';
import { type InputProps, useField } from '@strapi/strapi/admin';

import UploadWidget from "./UploadWidget";

const Input = React.forwardRef(({ name }: { name: string }) => {

    const field = useField(name)
    console.log(field.value)
    const [publicId, setPublicId] = React.useState('');
    const [imageUrl, setImage] = React.useState(field.value || '');
    console.log('name', name)
   
    console.log('field', field)
    console.log('field.value', field.value)

    const handleSelect = (data: any) => {
        const newImageUrl = data.assets[0]?.secure_url;
        updateImage(newImageUrl)
    }

    const updateImage = (newImageUrl: string) => {
        field.onChange(name, newImageUrl)
        setImage(newImageUrl)
    }

    return (
        <Field.Root>

            <Field.Label>Image</Field.Label>

            {imageUrl &&
            <>
                <Button onClick={() => updateImage('')}>Remove</Button>
                <img src={imageUrl} alt="Uploaded content" />
            </>
            }

            <UploadWidget onSelect={handleSelect}>
                Upload Image
            </UploadWidget>

        </Field.Root>
    );
});

export default Input;