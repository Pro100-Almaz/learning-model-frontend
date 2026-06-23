// Vitest global setup — extend as suites need it.
// jsdom is configured in vitest.config.ts.

import { afterEach } from 'vitest'
import { config } from '@vue/test-utils'

afterEach(() => {
  // Reset @vue/test-utils global plugins/stubs between tests if any are added.
  config.global.plugins = []
})
