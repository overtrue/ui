import "maplibre-gl/dist/maplibre-gl.css";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { useState, useRef, useEffect, type HTMLAttributes } from "react";
import "jsvectormap/dist/jsvectormap.css";
import mapConfigs from "@/data/workspace/maps.json";

/** Render geographic examples with explicit region data, markers, and routes. */
export function WorkspaceMap({
  className,
  style,
  id = "map-world",
}: HTMLAttributes<HTMLDivElement>) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let instance: { destroy(): void; updateSize(): void } | undefined;
    let observer: ResizeObserver | undefined;
    import("jsvectormap").then(async ({ default: VectorMap }) => {
      await Promise.all([
        import("jsvectormap/dist/maps/world.js"),
        import("jsvectormap/dist/maps/world-merc.js"),
      ]);
      if (disposed || !host.current) return;
      const options: Record<string, unknown> = (
        mapConfigs as Record<string, Record<string, unknown>>
      )[id] ?? {
        map: "world",
        backgroundColor: "transparent",
        zoomButtons: false,
        zoomOnScroll: false,
      };
      instance = new VectorMap({
        ...options,
        selector: host.current,
        ...(options.markers
          ? {
              labels: {
                markers: { render: (marker: { name: string }) => marker.name },
              },
            }
          : {}),
      });
      observer = new ResizeObserver(() => instance?.updateSize());
      observer.observe(host.current);
    });
    return () => {
      disposed = true;
      observer?.disconnect();
      instance?.destroy();
    };
  }, [id]);
  return (
    <div
      id={id}
      className={className}
      style={{ position: "relative", minHeight: 240, ...style }}
    >
      <div ref={host} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

export function WorkspaceTileMap({
  className,
  id,
}: HTMLAttributes<HTMLDivElement>) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let disposed = false;
    setError(null);
    setLoading(true);
    const timeout = window.setTimeout(() => {
      if (!disposed) {
        setError("Map tiles could not be loaded.");
        setLoading(false);
      }
    }, 12000);
    let map: import("maplibre-gl").Map | undefined;
    import("maplibre-gl")
      .then(({ Map, NavigationControl, Marker, setWorkerUrl }) => {
        if (disposed || !host.current) return;
        try {
          // Emit the worker and its imports through Vite instead of a missing relative URL.
          setWorkerUrl(mapWorkerUrl);
          map = new Map({
            container: host.current,
            style: `https://tiles.openfreemap.org/styles/${id?.includes("light") ? "positron" : "liberty"}`,
            center: [13.4049, 52.518827],
            zoom: 13,
            attributionControl: { compact: true },
          });
          map.addControl(new NavigationControl(), "top-right");
          if (id?.includes("markers"))
            new Marker({ color: "#066fd1" })
              .setLngLat([13.4049, 52.518827])
              .addTo(map);
          map.on("idle", () => {
            if (!disposed) {
              clearTimeout(timeout);
              setLoading(false);
              setError(null);
            }
          });
          map.on("error", (event) => {
            if (!disposed) {
              clearTimeout(timeout);
              setError(event.error.message);
              setLoading(false);
            }
          });
        } catch {
          if (!disposed) {
            clearTimeout(timeout);
            setError("Map tiles could not be loaded.");
            setLoading(false);
          }
        }
      })
      .catch(() => {
        if (!disposed) {
          clearTimeout(timeout);
          setError("Map tiles could not be loaded.");
          setLoading(false);
        }
      });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      map?.remove();
    };
  }, [id, attempt]);
  return (
    <div
      className={className}
      id={id}
      style={{
        height: "100%",
        minHeight: id === "map-google" ? "calc(100svh - 180px)" : 240,
        position: "relative",
      }}
    >
      <div ref={host} style={{ position: "absolute", inset: 0 }} />
      {loading && !error && (
        <div className="workspace-map-label" role="status">
          Loading map tiles…
        </div>
      )}
      {error && (
        <div className="workspace-map-label" role="status" title={error}>
          Map tiles could not be loaded. Check your connection.{" "}
          <button
            type="button"
            className="pn-btn pn-btn-sm pn-ms-2"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Retry map
          </button>
        </div>
      )}
    </div>
  );
}
