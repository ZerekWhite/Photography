export type ImageFormat = 'jpg' | 'jpeg' | 'png'

export type ImageVariant = {
  type: string
  srcSet: string
  sizes?: string
}

const OPTIMIZED_DIR = '/images/optimized'

const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280, 1600, 1920, 2560] as const

function parseImagePath(src: string): { name: string; ext: ImageFormat } | null {
  const match = src.match(/^\/images\/(.+)\.(jpg|jpeg|png)$/i)
  if (!match) return null
  const name = match[1]
  const ext = match[2].toLowerCase() as ImageFormat
  return { name, ext }
}

function buildSrcSet(name: string, ext: string, widths: readonly number[]): string {
  const slashIndex = name.lastIndexOf('/')
  const subDir = slashIndex >= 0 ? name.slice(0, slashIndex) : ''
  const baseName = slashIndex >= 0 ? name.slice(slashIndex + 1) : name
  const optimizedDir = subDir ? `${OPTIMIZED_DIR}/${subDir}` : OPTIMIZED_DIR
  return widths.map((w) => `${optimizedDir}/${baseName}-${w}.${ext} ${w}w`).join(', ')
}

export function getOptimizedImageSources(options: {
  src: string
  sizes?: string
  widths?: readonly number[]
}): { sources: ImageVariant[]; imgSrc: string; imgSrcSet?: string; imgSizes?: string } {
  const parsed = parseImagePath(options.src)
  const widths = options.widths ?? DEFAULT_WIDTHS

  if (!parsed) {
    return {
      sources: [],
      imgSrc: options.src,
      imgSizes: options.sizes,
    }
  }

  const sources: ImageVariant[] = [
    {
      type: 'image/webp',
      srcSet: buildSrcSet(parsed.name, 'webp', widths),
      sizes: options.sizes,
    },
  ]

  const defaultWidth = widths[Math.floor(widths.length / 2)] ?? 1280
  const slashIndex = parsed.name.lastIndexOf('/')
  const subDir = slashIndex >= 0 ? parsed.name.slice(0, slashIndex) : ''
  const baseName = slashIndex >= 0 ? parsed.name.slice(slashIndex + 1) : parsed.name
  const optimizedDir = subDir ? `${OPTIMIZED_DIR}/${subDir}` : OPTIMIZED_DIR
  const imgSrc = `${optimizedDir}/${baseName}-${defaultWidth}.webp`

  return {
    sources,
    imgSrc,
    imgSrcSet: sources[0]?.srcSet,
    imgSizes: options.sizes,
  }
}

export function getImageLoadingProps(options: { priority?: boolean } = {}) {
  return {
    loading: options.priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    fetchPriority: options.priority ? ('high' as const) : ('low' as const),
  }
}
