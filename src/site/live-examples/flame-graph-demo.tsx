import { FlameGraph, type FlameNode } from "@/registry/overtrue/flame-graph";

/** A frame whose value is its own self time plus everything it calls. */
function frame(
  name: string,
  self: number,
  children: FlameNode[] = [],
  group?: string,
): FlameNode {
  return {
    name,
    group,
    value: +(self + children.reduce((sum, child) => sum + child.value, 0)).toFixed(2),
    children: children.length ? children : undefined,
  };
}

// App code, Node built-ins and React components share a colour per group.
const app = (name: string, self: number, children: FlameNode[] = []) =>
  frame(name, self, children, "app");
const node = (name: string, self: number, children: FlameNode[] = []) =>
  frame(name, self, children, "node");
const ui = (name: string, self: number, children: FlameNode[] = []) =>
  frame(name, self, children, "components");
const pg = (name: string, self: number, children: FlameNode[] = []) =>
  frame(name, self, children, "db");

/** db.query → pg driver → socket, the shape every query takes in the profile. */
const query = (send: number, parse: number, self = 1.2) =>
  frame("db.query", self, [
    pg("pg.Client.query", 1.6, [
      pg("pg.Connection.send", 1.8, [node("net.Socket.write", send)]),
      ...(parse ? [pg("pg.parseRows", parse * 0.35, [pg("pg.parseValue", parse * 0.65)])] : []),
    ]),
  ]);

// One server-rendered POST /api/checkout, sampled every millisecond.
const profile: FlameNode = frame("POST /api/checkout", 0.8, [
  app("handleRequest", 2.4, [
    frame("middleware.session", 1.6, [
      frame("redis.get", 1.4, [frame("redis.sendCommand", 2.9, [node("net.Socket.write", 7.6)])]),
    ]),
    frame("middleware.auth", 1.5, [
      frame("jwt.verify", 2.2, [node("crypto.verify", 3.8, [node("crypto.rsaVerify", 19.6)])]),
      query(7.8, 12.4),
    ]),
    frame("router.match", 2.1, [frame("path-to-regexp.exec", 6.3)]),
    app("checkout.handler", 2.8, [
      app("parseRequest", 1.9, [
        node("JSON.parse", 11.4),
        frame("zod.parse", 2.6, [frame("zod.object", 5.1, [frame("zod.string", 9.7)])]),
      ]),
      app("loadCart", 2.2, [
        query(12.8, 31.5),
        app("priceItems", 3.4, [app("tax.calculate", 4.6, [app("tax.lookupRate", 15.8)])]),
      ]),
      app("reserveInventory", 1.4, [
        frame("db.transaction", 2.6, [query(31.2, 0, 1.1), query(19.4, 0, 0.9)]),
      ]),
      app("chargePayment", 2.3, [
        app("payments.charge", 3.1, [
          node("https.request", 4.2, [
            node("tls.connect", 5.6, [node("tls.handshake", 38.2)]),
            node("http.parseResponse", 7.4),
          ]),
        ]),
      ]),
    ]),
    app("renderPage", 2.9, [
      frame("react-dom.renderToString", 4.1, [
        frame("react-dom.renderElement", 5.2, [
          ui("App", 1.8, [
            ui("Layout", 1.4, [
              ui("Header", 4.6, [ui("NavMenu", 8.1, [ui("NavLink", 9.4)])]),
              ui("CheckoutPage", 2.6, [
                ui("OrderSummary", 3.8, [
                  ui("LineItem", 12.6, [
                    app("formatCurrency", 2.4, [node("Intl.NumberFormat", 24.1)]),
                  ]),
                  ui("TotalsTable", 6.2, [app("formatCurrency", 1.6, [node("Intl.NumberFormat", 9.8)])]),
                ]),
                ui("ShippingForm", 5.4, [ui("AddressFields", 11.2, [ui("CountrySelect", 13.7)])]),
                ui("PaymentForm", 9.8, [ui("CardInput", 12.5)]),
              ]),
              ui("Footer", 7.3),
            ]),
          ]),
          frame("react-dom.escapeText", 26.4),
        ]),
      ]),
      node("JSON.stringify", 34.8),
      app("template.inject", 11.6),
    ]),
    node("zlib.gzip", 2.2, [node("zlib.deflate", 58.7), node("zlib.crc32", 8.3)]),
    frame("logger.info", 1.8, [node("JSON.stringify", 9.2)]),
  ]),
]);

export default function FlameGraphDemo() {
  return (
    <FlameGraph
      title="POST /api/checkout"
      description="CPU profile of one rendered request"
      data={profile}
    />
  );
}
