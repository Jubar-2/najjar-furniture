import { Panel, type ProductPanel } from "./Panel";

interface ProductFeatureSplitProps {
  left: ProductPanel;
  right: ProductPanel;
}

export default function ProductFeatureSplit({ left, right }: ProductFeatureSplitProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4">
      <Panel {...left} />
      <Panel {...right} />
    </section>
  );
}