"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader2, Check } from "lucide-react";
import Container from "@/components/utils/Container";
import { waLink } from "@/lib/contact";
import type { ContactSection } from "@/schemas/contact.schema";
import { Field } from "./Field";
import { InfoRow } from "./InfoRow";

export default function ContactFormPanel({ contact }: { contact: ContactSection }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleTopicSelect = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setTopic(detail);
    };
    window.addEventListener("contact-select-topic", handleTopicSelect);
    return () => window.removeEventListener("contact-select-topic", handleTopicSelect);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Please enter a valid email address.");
    if (!topic) return setError("Please choose a topic.");
    if (!message.trim()) return setError("Please write a message.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setSubmitted(true);
      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="bg-[#fdf6ee] py-12">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-8">
            <h3 className="text-lg font-semibold text-[#2b1810]">Send a Message</h3>
            <p className="mt-1 text-[12px] text-[#3a2c22]/60">
              Fill out the form and our team will get back to you shortly.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none placeholder:text-[#3a2c22]/40 focus:border-[#c9a06a]"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none placeholder:text-[#3a2c22]/40 focus:border-[#c9a06a]"
                  />
                </Field>
              </div>

              <Field label="Topic">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none focus:border-[#c9a06a]"
                >
                  <option value="">Select a topic</option>
                  {contact.topics.map((t) => (
                    <option key={t.label} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message">
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full resize-none rounded-lg border border-[#e5ded3] px-3.5 py-2.5 text-[13px] text-[#2b1810] outline-none placeholder:text-[#3a2c22]/40 focus:border-[#c9a06a]"
                />
              </Field>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] text-red-700">
                  {error}
                </div>
              )}

              {submitted && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-[12.5px] text-green-700">
                  <Check className="size-4" />
                  Message sent! Our team will get back to you shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6b3f22] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#5a341c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info + response times */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#2c160d] p-6 text-[#f2ead9] shadow-[0_4px_20px_rgba(0,0,0,0.08)] md:p-7">
              <h3 className="text-base font-semibold">Contact Details</h3>

              <div className="mt-5 space-y-4 text-[12.5px]">
                {contact.emails.map((item) => (
                  <InfoRow key={item.value + item.label} icon={<Mail className="size-4" />} label={`Email · ${item.label || "Email"}`} value={item.value} />
                ))}
                {contact.phones.map((item) => (
                  <InfoRow key={item.value + item.label} icon={<Phone className="size-4" />} label={`Phone · ${item.label || "Phone"}`} value={item.value} />
                ))}
                {contact.whatsapps.map((item) => (
                  <InfoRow
                    key={item.value + item.label}
                    icon={<Clock className="size-4" />}
                    label={`WhatsApp · ${item.label || "WhatsApp"}`}
                    value={item.value}
                    href={waLink(item.value)}
                  />
                ))}
                <InfoRow icon={<MapPin className="size-4" />} label="Address" value={contact.address} />
                <InfoRow icon={<Clock className="size-4" />} label="Showroom Hours" value={contact.showroomHours} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-7">
              <h3 className="text-sm font-semibold text-[#2b1810]">Response Times</h3>
              <ul className="mt-4 space-y-3">
                {contact.responseTimes.map((r) => (
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