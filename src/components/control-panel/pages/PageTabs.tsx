"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface PageTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

export default function PageTabs({ tabs, defaultTab, className }: PageTabsProps) {
  return (
    <Tabs defaultValue={defaultTab ?? tabs[0]?.key} className={className}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}