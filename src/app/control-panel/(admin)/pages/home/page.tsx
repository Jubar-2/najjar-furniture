import About from "@/components/control-panel/pages/home/About";
import Banner from "@/components/control-panel/pages/home/Banner";
import GalleryAdmin from "@/components/control-panel/pages/home/GalleryControl";
import PageTabs from "@/components/control-panel/pages/PageTabs";

export default function PagesHome() {
    return (
        <>
            {/* --- MAIN CONTENT AREA --- */}
            <main className="grow p-4 md:p-8 overflow-y-auto">
                <PageTabs
                    tabs={[
                        { key: "banner", label: "Banner", content: <Banner /> },
                        { key: "gallery", label: "Gallery", content: <GalleryAdmin /> },
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