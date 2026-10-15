import { useEffect, useMemo, useState } from "react";
import {
  GeoMap,
  type GeoMapArc,
  type GeoMapPoint,
} from "@/registry/overtrue/geo-map";

// A small seeded generator keeps the first render identical on every visit.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

type PoP = GeoMapPoint & { base: number };

const pops: PoP[] = [
  {
    id: "sfo",
    label: "San Francisco",
    description: "SFO",
    lat: 37.62,
    lng: -122.38,
    base: 61200,
  },
  {
    id: "dfw",
    label: "Dallas",
    description: "DFW",
    lat: 32.9,
    lng: -97.04,
    base: 38400,
  },
  {
    id: "jfk",
    label: "New York",
    description: "JFK",
    lat: 40.64,
    lng: -73.78,
    base: 84600,
  },
  {
    id: "gru",
    label: "São Paulo",
    description: "GRU",
    lat: -23.43,
    lng: -46.47,
    base: 33800,
    status: "warn",
  },
  {
    id: "lhr",
    label: "London",
    description: "LHR",
    lat: 51.47,
    lng: -0.45,
    base: 79300,
  },
  {
    id: "ams",
    label: "Amsterdam",
    description: "AMS",
    lat: 52.31,
    lng: 4.76,
    base: 46100,
  },
  {
    id: "fra",
    label: "Frankfurt",
    description: "FRA",
    lat: 50.03,
    lng: 8.57,
    base: 68900,
  },
  {
    id: "jnb",
    label: "Johannesburg",
    description: "JNB",
    lat: -26.13,
    lng: 28.24,
    base: 17600,
  },
  {
    id: "dxb",
    label: "Dubai",
    description: "DXB",
    lat: 25.25,
    lng: 55.36,
    base: 29400,
  },
  {
    id: "bom",
    label: "Mumbai",
    description: "BOM",
    lat: 19.09,
    lng: 72.87,
    base: 52700,
    status: "critical",
  },
  {
    id: "sin",
    label: "Singapore",
    description: "SIN",
    lat: 1.36,
    lng: 103.99,
    base: 58200,
  },
  {
    id: "hkg",
    label: "Hong Kong",
    description: "HKG",
    lat: 22.31,
    lng: 113.92,
    base: 41500,
  },
  {
    id: "hnd",
    label: "Tokyo",
    description: "HND",
    lat: 35.55,
    lng: 139.78,
    base: 73800,
  },
  {
    id: "syd",
    label: "Sydney",
    description: "SYD",
    lat: -33.94,
    lng: 151.18,
    base: 26900,
  },
];

// Where requests come from. Each city routes to its nearest healthy PoP.
const users: { id: string; at: [number, number] }[] = [
  { id: "vancouver", at: [49.28, -123.12] },
  { id: "mexico-city", at: [19.43, -99.13] },
  { id: "toronto", at: [43.65, -79.38] },
  { id: "lima", at: [-12.05, -77.04] },
  { id: "buenos-aires", at: [-34.6, -58.38] },
  { id: "lagos", at: [6.52, 3.38] },
  { id: "madrid", at: [40.42, -3.7] },
  { id: "moscow", at: [55.75, 37.62] },
  { id: "nairobi", at: [-1.29, 36.82] },
  { id: "delhi", at: [28.61, 77.21] },
  { id: "jakarta", at: [-6.2, 106.85] },
  { id: "seoul", at: [37.57, 126.98] },
  { id: "perth", at: [-31.95, 115.86] },
];

function distance(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number],
) {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) *
      Math.cos(lat2 * r) *
      Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 2 * Math.asin(Math.sqrt(a));
}

const rps = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function Demo() {
  const [points, setPoints] = useState<PoP[]>(() =>
    pops.map((pop) => ({ ...pop, value: pop.base })),
  );

  useEffect(() => {
    const random = seeded(11);
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setPoints((current) =>
        current.map((pop) => {
          const value = pop.value ?? pop.base;
          // Wander a little, then drift back towards the PoP's usual rate.
          const next =
            value +
            (random() - 0.5) * pop.base * 0.12 +
            (pop.base - value) * 0.25;
          return { ...pop, value: Math.max(pop.base * 0.6, next) };
        }),
      );
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const arcs = useMemo<GeoMapArc[]>(() => {
    const healthy = pops.filter((pop) => pop.status !== "critical");
    return users.map((user) => {
      let best = healthy[0];
      for (const pop of healthy)
        if (
          distance(user.at, [pop.lat, pop.lng]) <
          distance(user.at, [best.lat, best.lng])
        )
          best = pop;
      return { id: user.id, from: user.at, to: best.id };
    });
  }, []);

  return (
    <GeoMap
      title="Edge network"
      description="Requests per second by PoP. Users route to the nearest healthy region."
      actions={
        <span className="inline-flex h-6 items-center gap-1.5 rounded-full border px-2 text-[11px] font-medium text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
            <span className="relative size-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      }
      points={points}
      arcs={arcs}
      valueLabel="req/s"
      valueFormatter={(value) => rps.format(value).replace("K", "k")}
    />
  );
}
