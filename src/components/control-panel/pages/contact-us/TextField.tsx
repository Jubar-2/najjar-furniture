import { Input } from "@/components/ui/input";
import type { ContactSection } from "@/schemas/contact.schema";
import type { UseFormReturn } from "react-hook-form";

export default function TextField({ form, name }: { form: UseFormReturn<ContactSection>; name: "address" | "showroomHours" }) {
    return (
        <Input {...form.register(name)} />
    );
}