declare module "dom-to-image-more" {
  export interface Options {
    filter?: (node: Node) => boolean
    bgcolor?: string
    width?: number
    height?: number
    style?: Partial<CSSStyleDeclaration>
    quality?: number
    scale?: number
    cacheBust?: boolean
  }

  const domtoimage: {
    toBlob: (node: HTMLElement, options?: Options) => Promise<Blob>
    toPng: (node: HTMLElement, options?: Options) => Promise<string>
    toJpeg: (node: HTMLElement, options?: Options) => Promise<string>
    toSvg: (node: HTMLElement, options?: Options) => Promise<string>
  }

  export default domtoimage
}
