"use client";

import Container from "@/components/utils/Container";
import { resolveTopicIcon } from "@/lib/contact";
import type { Topic } from "@/schemas/contact.schema";

interface ContactHelpCategoriesProps {
  topics: Topic[];
}

export default function ContactHelpCategories({ topics }: ContactHelpCategoriesProps) {
  const handleClick = (label: string) => {
    window.dispatchEvent(new CustomEvent("contact-select-topic", { detail: label }));
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#fdf6ee] pb-4 pt-12">
      <Container>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#2b1810] md:text-xl">
            What do you need help with?
          </h2>
          <p className="mt-1.5 text-[12.5px] text-[#3a2c22]/60">
            Tap a topic to jump straight to the form, or just send us a message below.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {topics && topics.length > 0 ? (
            topics.map((topic) => {
              const Icon = resolveTopicIcon(topic.icon);
              return (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => handleClick(topic.label)}
                  className="flex items-center gap-2 rounded-full border border-[#e5ded3] bg-white px-4 py-2 text-[12px] font-medium text-[#3a2c22] shadow-sm transition-colors hover:border-[#c9a06a] hover:text-[#6b3f22]"
                >
                  <span className="text-[#c9a06a]">
                    <Icon className="size-4" />
                  </span>
                  {topic.label}
                </button>
              );
            })
          ) : (
            <p className="text-[12.5px] text-[#3a2c22]/60">Topics are being set up.</p>
          )}
        </div>
      </Container>
    </section>
  );
}