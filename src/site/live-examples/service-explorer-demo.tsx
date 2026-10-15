import {
  ServiceExplorer,
  sampleServiceExplorer,
} from "@/registry/overtrue/service-explorer";

export default function ServiceExplorerDemo() {
  return (
    <ServiceExplorer data={sampleServiceExplorer} defaultSelectedId="checkout" />
  );
}
