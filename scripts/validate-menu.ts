/* Fails the build if src/data/menu.ts is malformed. Run by `pnpm build`. */
import { z } from 'zod'
import { validateMenu } from '../src/data/menu.schema'

const result = validateMenu()
if (!result.success) {
  console.error('\n✗ src/data/menu.ts failed validation:\n')
  console.error(z.prettifyError(result.error))
  process.exit(1)
}
console.log('✓ menu.ts is valid')
