import { test as base } from '@playwright/test'

import { PageManager } from '../pages/utils/page_instances'

type PageFixtures = {
  pages: PageManager
}

export const test = base.extend<PageFixtures>({
  pages: async ({}, use) => {
    const pageManager = new PageManager()

    await use(pageManager)
  }
})
