import { FlameGraph, type FlameNode } from "@/registry/overtrue/flame-graph";

function frame(name: string, self: number, children: FlameNode[] = []): FlameNode {
  return {
    name,
    value: +(self + children.reduce((sum, child) => sum + child.value, 0)).toFixed(2),
    children: children.length ? children : undefined,
  };
}

/** The data layer: encode parameters, send over the wire, decode the rows that come back. */
const query = (name: string, encode: number, send: number, decode: number) =>
  frame(name, 1.1, [
    frame("db.pool.acquire", 1.6),
    ...(encode ? [frame("db.encodeParams", encode)] : []),
    frame("pg.Client.query", 1.4, [frame("pg.Connection.send", send)]),
    ...(decode ? [frame("db.decodeRows", decode)] : []),
  ]);

// A nightly job that reconciles orders against the payment ledger, in wall time.
const profile: FlameNode = frame("worker.run", 0.9, [
  frame("jobs.reconcileOrders", 2.6, [
    frame("jobs.loadBatch", 1.4, [
      query("db.query", 2.2, 17.8, 52.4),
      frame("csv.parse", 4.1, [frame("csv.parseLine", 22.6)]),
    ]),
    frame("jobs.matchLedger", 3.2, [
      frame("ledger.index", 5.8, [frame("Map.set", 9.4)]),
      frame("ledger.lookup", 2.4, [query("db.query", 0, 8.9, 13.7)]),
      frame("money.compare", 6.1, [frame("decimal.cmp", 18.3)]),
    ]),
    frame("jobs.writeResults", 1.7, [
      frame("db.transaction", 2.3, [
        query("db.insertMany", 31.2, 24.1, 0),
        query("db.query", 3.4, 7.6, 6.2),
        frame("db.commit", 8.6),
      ]),
      frame("s3.putObject", 1.5, [
        frame("zlib.gzip", 1.1, [frame("zlib.deflate", 27.5)]),
        frame("https.request", 2.3, [frame("tls.write", 11.2)]),
      ]),
    ]),
    frame("metrics.flush", 0.9, [frame("JSON.stringify", 6.4), frame("udp.send", 2.1)]),
  ]),
  frame("gc.minor", 16.8),
]);

export default function FlameGraphSearchDemo() {
  return (
    <FlameGraph
      title="reconcile-orders job"
      description="Wall time, colored by self time, with the data layer highlighted"
      data={profile}
      orientation="flame"
      colorBy="self"
      defaultSearch="db."
      showTopFunctions={6}
    />
  );
}
