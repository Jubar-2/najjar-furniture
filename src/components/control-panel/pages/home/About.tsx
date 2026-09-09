"use client";

import { useState } from "react";
import TiptapEditor from "@/components/control-panel/pages/TiptapEditor";

function About() {
    const [html, setHtml] = useState("");

    return (
        <div className="w-full">
            <TiptapEditor content={html} onChange={setHtml} placeholder="Write your content..." />
        </div>
    );
}

export default About;