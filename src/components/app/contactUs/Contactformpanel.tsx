"use client";

import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Container from "@/components/utils/Container";

const RESPONSE_TIMES = [
  { channel: "Phone", time: "Instant" },
  { channel: "WhatsApp", time: "< 30 mins" },
  { channel: "Email", time: "1–2 days" },
  { channel: "Contact Form", time: "1–2 days" },
];

export default function ContactFormPanel() {
  return (
    <section className="bg-[#fdf6ee] py-12">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-8">
            <h3 className="text-lg font-semibold text-[#2b1810]">Send a Message</h3>
            <p className="mt-1 text-[12px] text-[#3a2c22]/60">
              Fill out the form and our team will get back to you shortly.
            </p>

            <form className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none placeholder:text-[#3a2c22]/40 focus:border-[#c9a06a]"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none placeholder:text-[#3a2c22]/40 focus:border-[#c9a06a]"
                  />
                </Field>
              </div>

              <Field label="Topic">
                <select className="w-full rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none focus:border-[#c9a06a]">
                  <option>Select a topic</option>
                  <option>General Inquiry</option>
                  <option>Custom Order</option>
                  <option>Bulk / Wholesale</option>
                  <option>Delivery & Shipping</option>
                  <option>Warranty & Repair</option>
                  <option>Showroom Visit</option>
                </select>
              </Field>

              <Field label="Message">
                <textarea
                  rows={5}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full resize-none rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none placeholder:text-[#3a2c22]/40 focus:border-[#c9a06a]"
                />
              </Field>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6b3f22] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#5a341c]"
              >
                Send Message
                <Send className="size-3.5" />
              </button>
            </form>
          </div>

          {/* Contact info + response times */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#2c160d] p-6 text-[#f2ead9] shadow-[0_4px_20px_rgba(0,0,0,0.08)] md:p-7">
              <h3 className="text-base font-semibold">Contact Details</h3>

              <div className="mt-5 space-y-4 text-[12.5px]">
                <InfoRow icon={<Mail className="size-4" />} label="Email" value="support@najjarfurniture.com" />
                <InfoRow icon={<Phone className="size-4" />} label="Phone" value="+880 1XXX-XXXXXX" />
                <InfoRow icon={<MapPin className="size-4" />} label="Address" value="Dhaka, Bangladesh" />
                <InfoRow icon={<Clock className="size-4" />} label="Showroom Hours" value="Sat–Thu, 10am–8pm" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-7">
              <h3 className="text-sm font-semibold text-[#2b1810]">Response Times</h3>
              <ul className="mt-4 space-y-3">
                {RESPONSE_TIMES.map((r) => (
                  <li
                    key={r.channel}
                    className="flex items-center justify-between text-[12.5px] text-[#3a2c22]/75"
                  >
                    <span>{r.channel}</span>
                    <span className="font-medium text-[#2b1810]">{r.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-medium text-[#3a2c22]/70">{label}</span>
      {children}
    </label>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#c9a06a]">{icon}</span>
      <div>
        <p className="text-[#f2ead9]/60">{label}</p>
        <p className="font-medium text-[#f2ead9]">{value}</p>
      </div>
    </div>
  );
}