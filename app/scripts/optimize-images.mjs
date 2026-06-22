import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const inputDir = path.resolve(process.cwd(), 'public/images')
const outputDir = path.resolve(process.cwd(), 'public/images/optimized')

const widths = [96, 128, 160, 256, 320, 480, 640, 960, 1280, 1600, 1920, 2560]
const widthSet = new Set(widths)
const rasterExts = ['jpg', 'jpeg', 'png']

let totalSources = 0
let skippedImages = 0
let generatedImages = 0
let deletedOutputs = 0

async function listFilesRecursive(dir, { ignoreDirNames = [] } = {}) {
  const results = []
  const ignoreSet = new Set(ignoreDirNames)

  async function walk(absDir, relDir) {
    const entries = await fs.readdir(absDir, { withFileTypes: true })
    await Promise.all(
      entries.map(async (ent) => {
        const relPath = relDir ? `${relDir}/${ent.name}` : ent.name
        const absPath = path.join(absDir, ent.name)

        if (ent.isDirectory()) {
          if (ignoreSet.has(ent.name)) return
          await walk(absPath, relPath)
          return
        }

        if (ent.isFile()) results.push(relPath)
      })
    )
  }

  await walk(dir, '')
  return results
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function shouldSkip(inputPath, outputPaths) {
  const inputStat = await fs.stat(inputPath)
  const outputsExist = await Promise.all(outputPaths.map((p) => fileExists(p)))
  if (outputsExist.some((exists) => !exists)) return false
  const outputStats = await Promise.all(outputPaths.map((p) => fs.stat(p)))
  return outputStats.every((s) => s.mtimeMs >= inputStat.mtimeMs)
}

function getBaseName(filename) {
  const ext = path.extname(filename)
  return { name: filename.slice(0, -ext.length), ext: ext.slice(1).toLowerCase() }
}

function parseOptimizedFilename(file) {
  const match = file.match(/^(.*)-(\d+)\.(webp|jpg|png)$/i)
  if (!match) return null
  const baseName = match[1]
  const width = Number(match[2])
  const ext = match[3].toLowerCase()
  if (!widthSet.has(width)) return null
  return { baseName, width, ext }
}

async function cleanupStaleOutputs() {
  const entries = await listFilesRecursive(outputDir).catch(() => [])

  await Promise.all(
    entries.map(async (relFile) => {
      const parsed = parseOptimizedFilename(relFile)
      if (!parsed) return
      if (parsed.ext !== 'webp') {
        deletedOutputs += 1
        await fs.rm(path.join(outputDir, relFile), { force: true })
        return
      }
      const sourceChecks = await Promise.all(
        rasterExts.map((ext) => fileExists(path.join(inputDir, `${parsed.baseName}.${ext}`)))
      )
      const hasSource = sourceChecks.some(Boolean)
      if (hasSource) return
      deletedOutputs += 1
      await fs.rm(path.join(outputDir, relFile), { force: true })
    })
  )
}

async function optimizeOne({ file, force }) {
  const { name, ext } = getBaseName(file)
  if (!rasterExts.includes(ext)) return
  if (file === 'optimized' || file.startsWith('optimized/')) return

  const inputPath = path.join(inputDir, file)
  if (!(await fileExists(inputPath))) return

  totalSources += 1

  const relOutDir = path.dirname(name)
  const outputDirForFile = path.join(outputDir, relOutDir === '.' ? '' : relOutDir)
  await fs.mkdir(outputDirForFile, { recursive: true })
  const outputBaseName = path.basename(name)

  const outputPaths = widths.map((w) => path.join(outputDirForFile, `${outputBaseName}-${w}.webp`))

  if (!force) {
    const skip = await shouldSkip(inputPath, outputPaths)
    if (skip) {
      skippedImages += 1
      return
    }
  }

  const inputBuffer = await fs.readFile(inputPath)
  const base = sharp(inputBuffer, { failOnError: false })

  await Promise.all(
    widths.map(async (w) => {
      const resized = base.clone().resize({ width: w, withoutEnlargement: true })

      const webpOut = path.join(outputDirForFile, `${outputBaseName}-${w}.webp`)
      await resized
        .clone()
        .webp({ quality: 78 })
        .toFile(webpOut)
    })
  )

  generatedImages += 1
}

async function runPool(items, worker, concurrency) {
  const queue = [...items]
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const item = queue.shift()
      if (!item) return
      await worker(item)
    }
  })
  await Promise.all(workers)
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const clean = args.has('--clean')
  const force = args.has('--force')

  if (clean) {
    await fs.rm(outputDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  }

  await fs.mkdir(outputDir, { recursive: true })
  await cleanupStaleOutputs()
  const start = Date.now()
  const entries = await listFilesRecursive(inputDir, { ignoreDirNames: ['optimized'] })
  await runPool(
    entries.map((file) => ({ file, force })),
    optimizeOne,
    4
  )

  const duration = ((Date.now() - start) / 1000).toFixed(2)
  console.log(
    `[images:optimize] scanned=${entries.length} sources=${totalSources} generated=${generatedImages} skipped=${skippedImages} deleted=${deletedOutputs} clean=${clean} force=${force} time=${duration}s`
  )
}

await main()
