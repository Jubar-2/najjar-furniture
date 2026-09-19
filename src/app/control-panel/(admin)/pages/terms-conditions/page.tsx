"use client";

import PageTabs from "@/components/control-panel/pages/PageTabs";
import PageBannerAdmin from "@/components/control-panel/pages/PageBannerAdmin";
import TermsConditionsAdmin from "@/components/control-panel/pages/terms-conditions/TermsConditionsAdmin";

export default function PagesTermsConditions() {
    return (
        <main className="grow p-4 md:p-8 overflow-y-auto">
            <PageTabs
                tabs={[
                    {
                        key: "banner",
                        label: "Banner",
                        content: (
                            <PageBannerAdmin
                                pageName="terms-conditions"
                                defaultTitle="Terms & Conditions"
                                defaultImage="/images/legal-banner.jpg"
                            />
                        ),
                    },
                    {
                        key: "content",
                        label: "Terms Content",
                        content: <TermsConditionsAdmin />,
                    },
                ]}
            />
        </main>
    );
}
