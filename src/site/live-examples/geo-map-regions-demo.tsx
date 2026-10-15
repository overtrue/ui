import { useState } from "react";
import {
  GeoMap,
  type GeoMapPoint,
  type GeoMapStatus,
} from "@/registry/overtrue/geo-map";
import { cn } from "@/lib/utils";

const cities: (GeoMapPoint & { value: number })[] = [
  {
    id: "nyc",
    label: "New York",
    description: "US",
    lat: 40.71,
    lng: -74.01,
    value: 412,
  },
  {
    id: "lon",
    label: "London",
    description: "GB",
    lat: 51.51,
    lng: -0.13,
    value: 341,
  },
  {
    id: "sfo",
    label: "San Francisco",
    description: "US",
    lat: 37.77,
    lng: -122.42,
    value: 296,
  },
  {
    id: "tyo",
    label: "Tokyo",
    description: "JP",
    lat: 35.68,
    lng: 139.69,
    value: 254,
  },
  {
    id: "blr",
    label: "Bengaluru",
    description: "IN",
    lat: 12.97,
    lng: 77.59,
    value: 203,
    status: "warn",
  },
  {
    id: "ber",
    label: "Berlin",
    description: "DE",
    lat: 52.52,
    lng: 13.4,
    value: 187,
  },
  {
    id: "sao",
    label: "São Paulo",
    description: "BR",
    lat: -23.55,
    lng: -46.63,
    value: 172,
  },
  {
    id: "sin",
    label: "Singapore",
    description: "SG",
    lat: 1.35,
    lng: 103.82,
    value: 168,
  },
  {
    id: "syd",
    label: "Sydney",
    description: "AU",
    lat: -33.87,
    lng: 151.21,
    value: 143,
    status: "critical",
  },
  {
    id: "tor",
    label: "Toronto",
    description: "CA",
    lat: 43.65,
    lng: -79.38,
    value: 138,
    status: "warn",
  },
  {
    id: "dxb",
    label: "Dubai",
    description: "AE",
    lat: 25.2,
    lng: 55.27,
    value: 92,
  },
  {
    id: "mex",
    label: "Mexico City",
    description: "MX",
    lat: 19.43,
    lng: -99.13,
    value: 84,
  },
  {
    id: "jnb",
    label: "Johannesburg",
    description: "ZA",
    lat: -26.2,
    lng: 28.05,
    value: 57,
  },
];

const statusLabels: Record<GeoMapStatus, string> = {
  ok: "Healthy",
  warn: "At risk",
  critical: "Churn risk",
};
const dot: Record<GeoMapStatus, string> = {
  ok: "bg-primary",
  warn: "bg-amber-500",
  critical: "bg-destructive",
};
const total = cities.reduce((sum, city) => sum + city.value, 0);

export default function Demo() {
  const [selected, setSelected] = useState<string | null>("lon");

  return (
    <GeoMap
      title="Customers by city"
      description={`${total.toLocaleString("en-US")} accounts across ${cities.length} cities. Pick a city on the map or in the list.`}
      points={cities}
      valueLabel="Accounts"
      valueFormatter={(value) => value.toLocaleString("en-US")}
      statusLabels={statusLabels}
      selectedId={selected}
      onSelectedChange={(id) => setSelected(id)}
      aside={
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-2 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Top cities</span>
            <span>Accounts</span>
          </div>
          <ul className="flex flex-col px-2 pb-3">
            {cities.slice(0, 8).map((city) => {
              const status = city.status ?? "ok";
              const active = selected === city.id;
              return (
                <li key={city.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(active ? null : city.id)}
                    className={cn(
                      "group flex h-7 w-full items-center gap-2 rounded-md px-2 text-left text-xs outline-none transition-colors motion-reduce:transition-none",
                      "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
                      active && "bg-muted",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        dot[status],
                      )}
                    />
                    <span
                      className={cn(
                        "truncate",
                        active
                          ? "font-medium text-foreground"
                          : "text-foreground/85",
                      )}
                    >
                      {city.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {city.description}
                    </span>
                    <span className="ml-auto flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="hidden h-1 w-10 overflow-hidden rounded-full bg-muted sm:block"
                      >
                        <span
                          className={cn(
                            "block h-full rounded-full",
                            active ? "bg-primary" : "bg-muted-foreground/40",
                          )}
                          style={{
                            width: `${(city.value / cities[0].value) * 100}%`,
                          }}
                        />
                      </span>
                      <span className="w-8 text-right font-medium tabular-nums">
                        {city.value}
                      </span>
                    </span>
                    <span className="sr-only">, {statusLabels[status]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      }
    />
  );
}
