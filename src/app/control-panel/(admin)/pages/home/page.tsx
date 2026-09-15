import About from "@/components/control-panel/pages/home/About";
import Banner from "@/components/control-panel/pages/home/Banner";
import GalleryAdmin from "@/components/control-panel/pages/home/GalleryControl";
import HomeLayersAdmin from "@/components/control-panel/pages/home/HomeLayersAdmin";
import PortfolioAdmin from "@/components/control-panel/pages/home/PortfolioAdmin";
import PageTabs from "@/components/control-panel/pages/PageTabs";

export default function PagesHome() {
    return (
        <>
            {/* --- MAIN CONTENT AREA --- */}
            <main className="grow p-4 md:p-8 overflow-y-auto">
                <PageTabs
                    tabs={[
                        { key: "banner", label: "Banner", content: <Banner /> },
                         { key: "home-layers", label: "Home Layers", content: <HomeLayersAdmin /> },
                        { key: "gallery", label: "Gallery", content: <GalleryAdmin /> },
                        { key: "portfolio", label: "Portfolio", content: <PortfolioAdmin /> },
                        { key: "about", label: "About", content: <About /> },
                        { key: "settings", label: "Settings", content: <SettingsLayer /> },
                    ]}
                />
            </main>
        </>
    );
}




function AnalyticsLayer() {
    return <div>Analytics content...</div>;
}
function SettingsLayer() {
    return <div>Settings content...</div>;
}