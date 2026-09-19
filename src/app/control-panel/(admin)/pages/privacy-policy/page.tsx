"use client";

import PageTabs from "@/components/control-panel/pages/PageTabs";
import PageBannerAdmin from "@/components/control-panel/pages/PageBannerAdmin";
import PrivacyPolicyAdmin from "@/components/control-panel/pages/privacy-policy/PrivacyPolicyAdmin";

export default function PagesPrivacyPolicy() {
    return (
        <main className="grow p-4 md:p-8 overflow-y-auto">
            <PageTabs
                tabs={[
                    {
                        key: "banner",
                        label: "Banner",
                        content: (
                            <PageBannerAdmin
                                pageName="privacy-policy"
                                defaultTitle="Privacy Policy"
                                defaultImage="/images/legal-banner.jpg"
                            />
                        ),
                    },
                    {
                        key: "content",
                        label: "Policy Content",
                        content: <PrivacyPolicyAdmin />,
                    },
                ]}
            />
        </main>
    );
}