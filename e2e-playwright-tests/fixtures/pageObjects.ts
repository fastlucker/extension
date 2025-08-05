import { StabilityPage } from 'pages/stabilityPage'

import { test as base } from '@playwright/test'

import { PageManager } from '../pages/utils/page_instances'

type PageFixtures = {
  pages: PageManager
  stabilityPage: StabilityPage
}

export const test = base.extend<PageFixtures>({
  pages: async ({}, use) => {
    const pageManager = new PageManager()

    await use(pageManager)
  },
  // stability page is defined separatelly because it is used to monitor requests and should have browsers initialization separate from other pages
  stabilityPage: async ({}, use) => {
    await use(new StabilityPage())
  }
})
