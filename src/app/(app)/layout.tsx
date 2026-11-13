import type { Metadata } from "next";
import { getGoogleVerificationCode } from "@/lib/getPageMeta";
import { getBaseUrl } from "@/lib/siteUrl";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const verificationCode = await getGoogleVerificationCode();

  return {
    metadataBase: new URL(baseUrl),
    ...(verificationCode ? { verification: { google: verificationCode } } : {}),
  };
}

export default function PublicAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
