declare module "jsvectormap" {
  export default class VectorMap {
    constructor(options: Record<string, unknown>)
    destroy(): void
    updateSize(): void
  }
}
declare module "jsvectormap/dist/maps/world.js"
declare module "jsvectormap/dist/maps/world-merc.js"
