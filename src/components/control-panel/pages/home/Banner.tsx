"use client";

import { useState } from "react";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";

function Banner() {
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="max-w-md">
            <ImageUpload
                onChange={(file, previewUrl) => {
                    setFile(file);
                    console.log("selected file:", file, previewUrl);
                }}
                aspect="video"
            />
        </div>
    );
}

export default Banner;