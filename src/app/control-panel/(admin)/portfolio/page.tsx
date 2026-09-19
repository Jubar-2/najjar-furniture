import PageTabs from "@/components/control-panel/pages/PageTabs";
import PageBannerAdmin from "@/components/control-panel/pages/PageBannerAdmin";
import PortfolioItemsAdmin from "@/components/control-panel/portfolio/PortfolioItemsAdmin";

export default function PortfolioPage() {
    return (
        <main className="grow p-4 md:p-8 overflow-y-auto">
            <PageTabs
                tabs={[
                    {
                        key: "banner",
                        label: "Banner",
                        content: (
                            <PageBannerAdmin
                                pageName="portfolio"
                                defaultTitle="Portfolio"
                                defaultImage="/images/about-banner.jpg"
                            />
                        ),
                    },
                    {
                        key: "items",
                        label: "Portfolio Items",
                        content: <PortfolioItemsAdmin />,
                    },
                ]}
            />
        </main>
    );
}