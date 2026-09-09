import Sidebar from "@/components/control-panel/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return(
        <div className="min-h-screen bg-[rgb(240,242,245)] flex font-poppins">
            <Sidebar/>
            {children}
        </div>
    )
}