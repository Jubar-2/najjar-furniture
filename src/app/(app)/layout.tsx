import type { Metadata } from "next";
import { getGoogleVerificationCode } from "@/lib/getPageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const verificationCode = await getGoogleVerificationCode();

  if (!verificationCode) {
    return {};
  }

  return {
    verification: {
      google: verificationCode,
    },
  };
}

export default function PublicAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

