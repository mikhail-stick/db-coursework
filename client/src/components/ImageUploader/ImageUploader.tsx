import React, { useState } from 'react';
import {useImageUploader} from "../../hooks";

interface ImageUploaderProps {
    type: string
}
export function ImageUploader({type}: ImageUploaderProps): JSX.Element {

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file: File = event.target.files[0];

        }
    };

    return (
        <input className="image-uploader" type="file" accept="image/*" onChange={handleImageChange} />
    );
}
