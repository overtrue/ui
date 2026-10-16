import { JsonViewer } from "@/registry/overtrue/json-viewer";

// One server span for a checkout request. All identifiers and values are fictional.
const span = {
  name: "POST /api/checkout/confirm",
  traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
  spanId: "00f067aa0ba902b7",
  kind: "server",
  status: { code: "ok", message: null },
  startTime: "2026-10-14T14:05:12.284Z",
  durationMs: 1843.6,
  sampled: true,
  attributes: {
    "http.method": "POST",
    "http.status_code": 200,
    "http.url": "https://shop.acme.example/api/checkout/confirm?cart=c_81f2",
    "net.peer.ip": "10.4.18.231",
    "user_agent.original":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15 AcmeShop/4.12.0 (build 2026.10.11; channel stable; locale en-GB)",
    "retry.count": 0,
  },
  request: {
    headers: {
      "content-type": "application/json",
      "x-request-id": "req_9mZ2kq7Lx",
      authorization: "[redacted]",
    },
    body: {
      cartId: "c_81f2",
      currency: "EUR",
      items: [
        { sku: "SKU-1042", name: "Linen throw", qty: 2, unitPrice: 48 },
        { sku: "SKU-2210", name: "Oak serving board", qty: 1, unitPrice: 129.5, giftWrap: true },
        { sku: "SKU-0087", name: "Beeswax candle", qty: 3, unitPrice: 6.25, discount: null },
      ],
      coupon: null,
      express: false,
    },
  },
  timings: { dnsMs: 1.2, connectMs: 3.8, ttfbMs: 1802.4, totalMs: 1843.6 },
  resource: {
    "service.name": "checkout-api",
    "service.version": "2.31.0",
    "deployment.environment": "production",
  },
};

export default function Demo() {
  return (
    <JsonViewer
      title="Span payload"
      description="checkout-api · POST /api/checkout/confirm"
      rootName="span"
      data={span}
      defaultExpanded={[
        "span",
        "span.status",
        "span.attributes",
        "span.request",
        "span.request.body",
        "span.request.body.items",
        "span.timings",
      ]}
      maxStringLength={72}
      maxHeight={440}
    />
  );
}
