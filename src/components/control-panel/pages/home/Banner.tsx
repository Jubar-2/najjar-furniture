"use client";

import { useEffect, useRef, useState } from "react";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import { useGetBanner, useUpdateBanner } from "@/customHooks/getBanner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Banner() {
    const [file, setFile] = useState<File | null>(null);
    const { data, isLoading } = useGetBanner();
    const { mutate, isPending } = useUpdateBanner();

    const [heading, setHeading] = useState("");
    const [paragraph, setParagraph] = useState("");
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (data && !hasInitializedRef.current) {
            setHeading(data.heading ?? "");
            setParagraph(data.paragraph ?? "");
            hasInitializedRef.current = true;
        }
    }, [data]);

    function handleClick() {
        const form = new FormData();
        form.append("paragraph", paragraph);
        form.append("heading", heading);
        if (file) form.append("banner", file);

        mutate(form, {
            onSuccess: () => {
                hasInitializedRef.current = false;
            },
        });
    }

    if (isLoading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
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
                    <FieldLabel htmlFor="banner-heading">Heading</FieldLabel>
                    <Textarea
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        id="banner-heading"
                        placeholder="Type your heading here."
                    />
                </Field>
            </div>

            <div className="mt-3">
                <Field>
                    <FieldLabel htmlFor="banner-paragraph">Paragraph</FieldLabel>
                    <Textarea
                        value={paragraph}
                        onChange={(e) => setParagraph(e.target.value)}
                        id="banner-paragraph"
                        placeholder="Type your message here."
                    />
                </Field>
            </div>

            <Button onClick={handleClick} disabled={isPending} className="mt-3">
                {isPending && <Loader2 className="size-4 mr-1.5 animate-spin" />}
                Update
            </Button>
        </div>
    );
}

export default Banner;