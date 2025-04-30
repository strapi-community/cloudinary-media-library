import { forwardRef, useState } from "react";
import { useIntl } from "react-intl";

import { Field } from '@strapi/design-system';
import { useField } from '@strapi/strapi/admin';

import UploadWidget from "./UploadWidget";
import { getTranslation } from "../utils/getTranslation";
import type { CloudinaryUploadData } from "../types";
import { IconButton } from "@strapi/design-system";
import { Trash } from "@strapi/icons";
import { Box } from "@strapi/design-system";

type InputProps = {
    name: string;
}

const Input = forwardRef(({ name }: InputProps) => {
    const { formatMessage } = useIntl();

    const field = useField(name)
    const [imageUrl, setImage] = useState(field.value || '');

    const handleSelect = (data: CloudinaryUploadData) => {
        const newImageUrl = data.assets[0]?.secure_url;
        updateImage(newImageUrl)
    }

    const updateImage = (newImageUrl: string) => {
        field.onChange(name, newImageUrl)
        setImage(newImageUrl)
    }

    return (
        <Field.Root>
            <Field.Label>
                {name}
            </Field.Label>
            {imageUrl && (
                <Box position="relative">
                    <IconButton onClick={() => updateImage('')} position="absolute" right="0">
                        <Trash />
                    </IconButton>
                    <img src={imageUrl} alt={formatMessage({id: getTranslation('uploaded.label')})} />
                </Box>
            )}
            <UploadWidget onSelect={handleSelect}/>
        </Field.Root>
    );
});

export default Input;