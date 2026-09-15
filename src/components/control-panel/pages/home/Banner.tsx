"use client";

import { useState } from "react";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import { useGetBanner, useUpdateBanner } from "@/customHooks/getBanner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function Banner() {
    const [file, setFile] = useState<File | null>(null);
    const { data, isLoading } = useGetBanner();
    const { mutate } = useUpdateBanner()
    const [draft, setDraft] = useState<{ heading: string; paragraph: string } | null>(null)

    const saved = data ?? { heading: "", paragraph: "" }
    const heading = draft?.heading ?? saved.heading ?? ""
    const paragraph = draft?.paragraph ?? saved.paragraph ?? ""

    function handleClick() {

        const form = new FormData();
        form.append("paragraph", paragraph)
        form.append("heading", heading)
        if (file) form.append("banner", file)

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
                        onChange={(e) => setDraft((d) => ({ heading: e.target.value, paragraph: d?.paragraph ?? saved.paragraph ?? "" }))}
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
                        onChange={(e) => setDraft((d) => ({ heading: d?.heading ?? saved.heading ?? "", paragraph: e.target.value }))}
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