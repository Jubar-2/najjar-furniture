"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import { useGetBanner, useUpdateBanner } from "@/customHooks/getBanner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function Banner() {
    const [file, setFile] = useState<File | null>(null);
    const { data, isLoading } = useGetBanner();
    const { mutate } = useUpdateBanner()
    const [heading, setHeading] = useState<string | null>("");
    const [paragraph, setParagraph] = useState<string | null>("")

    useEffect(() => {
        if (!isLoading && data?.content?.heading) {
            setHeading(data.content.heading)
        }

        if (!isLoading && data?.content?.paragraph) {
            setParagraph(data.content.paragraph)
        }
    }, [data]);

    function handleClick() {

        const form = new FormData();
        form.append("paragraph", paragraph)
        form.append("heading", heading)
        form.append("banner", file)

        mutate(form);
    }

    return (
        <div className="max-w-md">
            <ImageUpload
                onChange={(file, previewUrl) => {
                    setFile(file);
                    console.log("selected file:", file, previewUrl);
                }}
                aspect="video"
            />

            <div className="mt-3">
                <Field>
                    <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
                    <Textarea
                        value={isLoading ? "loading..." : heading}
                        onChange={(e) => setHeading(e.target.value)}
                        id="textarea-disabled"
                        placeholder="Type your message here."
                    />
                </Field>
            </div>

            <div className="mt-3">
                <Field>
                    <FieldLabel htmlFor="textarea-disabled">Paragraph</FieldLabel>
                    <Textarea
                        value={isLoading ? "loading..." : paragraph}
                        onChange={(e) => setParagraph(e.target.value)}
                        id="textarea-disabled"
                        placeholder="Type your message here."
                    />
                </Field>
            </div>

            <Button onClick={handleClick} className="mt-3">Update</Button>
        </div>
    );
}

export default Banner;