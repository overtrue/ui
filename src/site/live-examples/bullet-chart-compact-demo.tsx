import {
  BulletChart,
  type BulletChartItem,
} from "@/registry/overtrue/bullet-chart";

// Billable utilization per person against their role's monthly target.
const people = [
  {
    id: "maya",
    label: "Maya Okafor",
    sublabel: "Design lead",
    value: 86,
    target: 75,
  },
  {
    id: "leo",
    label: "Leo Nakamura",
    sublabel: "Designer",
    value: 72,
    target: 80,
  },
  {
    id: "priya",
    label: "Priya Raman",
    sublabel: "Engineer",
    value: 91,
    target: 85,
  },
  {
    id: "tomas",
    label: "Tomás Alvarez",
    sublabel: "Engineer",
    value: 58,
    target: 85,
  },
  {
    id: "hana",
    label: "Hana Sato",
    sublabel: "Producer",
    value: 68,
    target: 65,
  },
  {
    id: "jonas",
    label: "Jonas Weber",
    sublabel: "Motion",
    value: 49,
    target: 75,
  },
  {
    id: "amara",
    label: "Amara Diallo",
    sublabel: "Writer",
    value: 77,
    target: 70,
  },
].map((person): BulletChartItem => ({
  ...person,
  ranges: [50, 70, 100],
  max: 100,
}));

export default function BulletChartCompactDemo() {
  return (
    <BulletChart
      size="compact"
      tone="status"
      title="Billable utilization"
      description="October, against each role’s target"
      items={people}
      valueFormatter={(value) => `${value}%`}
    />
  );
}
