import Link from "next/link";
import Container from "@/components/utils/Container";
import { resolveSocialIcon } from "@/lib/contact";
import type { SocialLink } from "@/schemas/contact.schema";

function formatName(name: string): string {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "Social";
}

export default function ConnectChannels({ socials }: { socials: SocialLink[] }) {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#f2ead9] px-3.5 py-1 text-[10.5px] font-medium text-[#6b3f22]">
            Find Us Everywhere
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[#6b3f22] md:text-4xl">
            Connect on Social Media
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[#3a2c22]/70">
            Follow Najjar Furniture for the latest craftsmanship, warmth, tips, and updates.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socials && socials.length > 0 ? (
            socials.map((channel) => {
              const Icon = resolveSocialIcon(channel.name);
              return (
                <Link
                  key={channel.name + channel.url}
                  href={channel.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-3 rounded-2xl border border-[#e5ded3] bg-[#fdf6ee] p-5 transition-colors hover:border-[#c9a06a]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#6b3f22] text-[#f2ead9]">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-semibold text-[#2b1810]">
                      {formatName(channel.name)}
                    </span>
                  </div>

                  <p className="truncate text-[11.5px] text-[#3a2c22]/60">{channel.url}</p>
                </Link>
              );
            })
          ) : (
            <p className="text-[13px] text-[#3a2c22]/70">Social channels are being set up.</p>
          )}
        </div>
      </Container>
    </section>
  );
}