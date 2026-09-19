import type { Metadata } from "next";
import { Cormorant_Upright, Noto_Sans_Arabic } from "next/font/google";
import QueryClientProvider from "@/providers/QueryClientProvider";
import { SITE_NAME } from "@/lib/sitePages";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorantUpright = Cormorant_Upright({
  variable: "--font-cormorant-upright",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} – Timeless Furniture, Thoughtfully Crafted`,
    template: `%s – ${SITE_NAME}`,
  },
  description:
    "Najjar Furniture offers handcrafted, timeless furniture for every room. Explore our portfolio of beautifully designed home and office pieces.",
  keywords: [
    "furniture",
    "handcrafted furniture",
    "najjar furniture",
    "custom furniture",
    "home decor",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${notoSansArabic.className} ${cormorantUpright.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col max-w-[2560px] mx-auto" suppressHydrationWarning>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>

    </html>
  );
}
