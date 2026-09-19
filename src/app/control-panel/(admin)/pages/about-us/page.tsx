"use client";

import PageTabs from "@/components/control-panel/pages/PageTabs";
import PageBannerAdmin from "@/components/control-panel/pages/PageBannerAdmin";
import AboutAdmin from "@/components/control-panel/pages/home/AboutAdmin";

export default function PagesAboutUs() {
    return (
        <main className="grow p-4 md:p-8 overflow-y-auto">
            <PageTabs
                tabs={[
                    {
                        key: "banner",
                        label: "Banner",
                        content: (
                            <PageBannerAdmin
                                pageName="about-us"
                                defaultTitle="About Us"
                                defaultImage="/images/about-banner.jpg"
                            />
                        ),
                    },
                    {
                        key: "content",
                        label: "About Content",
                        content: <AboutAdmin />,
                    },
                ]}
            />
        </main>
    );
}