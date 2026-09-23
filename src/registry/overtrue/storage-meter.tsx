import { ChartLegend } from "./chart-legend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export interface StorageSegment {
  label: string;
  value: number;
  color: string;
}
export function StorageMeter({
  segments,
  capacity,
  unit = "GB",
}: {
  segments: StorageSegment[];
  capacity: number;
  unit?: string;
}) {
  const safeCapacity = Number.isFinite(capacity) ? Math.max(0, capacity) : 0;
  const safeSegments = segments.map((segment) => ({
    ...segment,
    value: Number.isFinite(segment.value) ? Math.max(0, segment.value) : 0,
  }));
  const used = safeSegments.reduce((sum, segment) => sum + segment.value, 0);
  const denominator = Math.max(safeCapacity, used, 1);
  return (
    <Card className="gap-0 rounded-lg border bg-card py-0 shadow-none">
      <CardHeader className="px-5 pt-5 pb-0">
        <CardTitle className="text-sm font-semibold">
          Storage overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <p className="mb-4 text-sm text-muted-foreground">
          <strong className="font-semibold text-card-foreground">
            {used.toLocaleString()} {unit}
          </strong>{" "}
          of {safeCapacity.toLocaleString()} {unit} used
        </p>
        <div
          role="img"
          aria-label={`${used} of ${safeCapacity} ${unit} used`}
          className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-muted"
        >
          {safeSegments.map((segment) => (
            <span
              key={segment.label}
              style={{
                width: `${(segment.value / denominator) * 100}%`,
                backgroundColor: segment.color,
              }}
            />
          ))}
        </div>
        <ChartLegend
          className="mt-5"
          label="Storage categories"
          items={safeSegments.map((segment) => ({
            label: segment.label,
            color: segment.color,
            value: `${segment.value} ${unit}`,
          }))}
        />
      </CardContent>
    </Card>
  );
}
