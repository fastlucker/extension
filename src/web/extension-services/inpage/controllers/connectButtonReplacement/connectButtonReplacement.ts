/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { delayPromise } from '@common/utils/promises'

// Ambire SVG icon 40x40
export const ambireSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='40' height='40' viewBox='0 0 40 40'%3E%3Cdefs%3E%3ClinearGradient id='linear-gradient' x1='0.554' y1='0.58' x2='0.052' y2='0.409' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236000ff'/%3E%3Cstop offset='0.651' stop-color='%234900c3'/%3E%3Cstop offset='1' stop-color='%23320086'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='0.06' y1='-0.087' x2='0.486' y2='0.653' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236a0aff'/%3E%3Cstop offset='0.047' stop-color='%238c2dff'/%3E%3Cstop offset='0.102' stop-color='%236a0aff'/%3E%3Cstop offset='0.902' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%23af50ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-3' x1='1.071' y1='0.062' x2='0.095' y2='1.049' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236a0aff'/%3E%3Cstop offset='0.51' stop-color='%238c2dff'/%3E%3Cstop offset='0.969' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%23af50ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-4' x1='0.448' y1='0.297' x2='0.538' y2='0.8' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236000ff'/%3E%3Cstop offset='1' stop-color='%233e00a5'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-5' x1='-0.529' y1='1.069' x2='1.092' y2='0.86' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23ae60ff'/%3E%3Cstop offset='0.322' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%236000ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-6' x1='-0.111' y1='0.274' x2='0.872' y2='1.224' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236f0fff'/%3E%3Cstop offset='0.702' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%23af50ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-7' x1='0.015' y1='0.007' x2='0.985' y2='0.95' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23ae60ff'/%3E%3Cstop offset='0.031' stop-color='%23b670fa'/%3E%3Cstop offset='1' stop-color='%23be80f5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg id='ambire_symbol_40x40' data-name='ambire symbol 40x40' transform='translate(20193 20411)'%3E%3Cg id='Ambire_Wallet' data-name='Ambire Wallet' transform='translate(-20184.996 -20408.99)'%3E%3Cg id='_1967776972864' transform='translate(0.013 -0.01)'%3E%3Cg id='Group_190' data-name='Group 190'%3E%3Cpath id='Path_636' data-name='Path 636' d='M526.324,626.595l4.724,10.056a.284.284,0,0,1-.058.314l-12.427,12.007a.138.138,0,0,1-.233-.1V637.836l7.831-7.56a.254.254,0,0,0,.081-.2l.023-3.484c0-.023.047-.023.058,0Z' transform='translate(-507.107 -613.01)' fill='%236000ff'/%3E%3Cpath id='Path_637' data-name='Path 637' d='M518.34,803.227v11.032a.138.138,0,0,0,.233.1h0L531,802.356a.284.284,0,0,0,.058-.313h0l-4.852-6.413Z' transform='translate(-507.116 -778.401)' fill-rule='evenodd' fill='url(%23linear-gradient)'/%3E%3Cpath id='Path_638' data-name='Path 638' d='M881.705,626.01h0a.027.027,0,0,0-.028.028h0l-.02,3.483a.286.286,0,0,1-.046.162l4.871,6.574a.3.3,0,0,0-.023-.174h0l-4.724-10.056a.032.032,0,0,0-.028-.016h0Z' transform='translate(-862.52 -612.454)' fill-rule='evenodd' fill='url(%23linear-gradient-2)'/%3E%3Cpath id='Path_639' data-name='Path 639' d='M895.766,814.726a.3.3,0,0,0-.023-.174h0l-.245-.522-4.4-5.6,4.665,6.3Z' transform='translate(-871.805 -790.924)' fill='%23be80f5' fill-rule='evenodd'/%3E%3Cpath id='Path_640' data-name='Path 640' d='M41.775,235.523l-2.222,6.294a.292.292,0,0,0,.012.221l2.071,4.076-5.7,3.228a.149.149,0,0,1-.2-.058L34.5,246.718a.247.247,0,0,1,.023-.267l7.191-10.962a.035.035,0,0,1,.058.035Z' transform='translate(-33.728 -230.38)' fill='%236000ff'/%3E%3Cpath id='Path_641' data-name='Path 641' d='M57.616,235.46h0a.031.031,0,0,0-.022.009h0l-6.884,10.493-.008.014,4.727-4.179.015-.042h0v0L57.65,235.5a.034.034,0,0,0-.034-.044Z' transform='translate(-49.602 -230.361)' fill-rule='evenodd' fill='url(%23linear-gradient-3)'/%3E%3Cpath id='Path_642' data-name='Path 642' d='M34.516,532.813a.247.247,0,0,0-.023.267h0l1.233,2.566a.149.149,0,0,0,.2.058h0l5.7-3.228L39.554,528.4a.29.29,0,0,1-.012-.221Z' transform='translate(-33.718 -516.743)' fill-rule='evenodd' fill='url(%23linear-gradient-4)'/%3E%3Cpath id='Path_643' data-name='Path 643' d='M11.237.047V9.836a.279.279,0,0,1-.058.163h0L.067,25.06a.269.269,0,0,0,.035.36h0l7.8,7.525a.134.134,0,0,0,.221-.047h0L16.59,13.076a.32.32,0,0,0,0-.209h0L11.342.024a.05.05,0,0,0-.047-.034h0a.057.057,0,0,0-.057.057Z' transform='translate(-0.013 0.01)' fill-rule='evenodd' fill='url(%23linear-gradient-5)'/%3E%3Cpath id='Path_644' data-name='Path 644' d='M517.729,0h0a.057.057,0,0,0-.057.057l0,9.789a.276.276,0,0,1-.014.081l5.3,2.789L517.776.034A.05.05,0,0,0,517.729,0Zm-.069,9.927,1.012.581Z' transform='translate(-506.451 0)' fill-rule='evenodd' fill='url(%23linear-gradient-6)'/%3E%3Cpath id='Path_645' data-name='Path 645' d='M523.055,461.518v0a.319.319,0,0,0-.016-.1h0l-.067-.166-5.3-2.789,1.015.581Z' transform='translate(-506.461 -448.532)' fill-rule='evenodd' fill='url(%23linear-gradient-7)'/%3E%3Cpath id='Path_646' data-name='Path 646' d='M37.323,532.352l-.293.446,5.023-4.628Z' transform='translate(-36.228 -516.733)' fill='%23be80f5'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Crect id='Rectangle_1110' data-name='Rectangle 1110' width='40' height='40' transform='translate(-20193 -20411)' fill='none'/%3E%3C/g%3E%3C/svg%3E"

// We should replace on these pages
export const whitelistedEIP6963Pages = ['https://toros.finance', 'https://sigtool.ambire.com']

// Advanced observing DOM changes on these pages
export const forceReplacementForPages = ['https://verse.bitcoin.com', 'https://app.ib.xyz']

// Disable replacements on pages that contain some of these strings in the URL
// The script is well optimized but in case the page is with huge DOM there is some small delay on every mouse click
// TODO: extend it with other heavy pages
export const blacklistedPages = [
  'google',
  'youtube',
  'facebook',
  'amazon',
  'yahoo',
  'wikipedia',
  'reddit',
  'instagram',
  'twitter',
  'github',
  'gitlab',
  'linkedin',
  'dropbox',
  'adobe',
  'wordpress',
  'duckduckgo',
  'stackoverflow',
  'medium',
  'metamask',
  'dodoex'
]

type ConstructProps = {
  isEIP6963: boolean
}

type UpdateProps = {
  isEIP6963?: boolean
  observerOptions?: MutationObserverInit
}

export class ConnectButtonReplacementController {
  public doesWebpageReadOurProvider: boolean = false // if true then the webpage is a dApp

  public hasInteractedWithPage: Boolean = false

  #isEIP6963: boolean

  #mmOccurrencesOnFirstDOMLoad: number | null = null

  #shadowRoots: ShadowRoot[] | null = null

  #observer: MutationObserver | null = null

  #observerOptions: MutationObserverInit

  #clickListener: any

  #initializeReplacementTimeout: any

  constructor({ isEIP6963 }: ConstructProps) {
    this.#isEIP6963 = isEIP6963
    this.#observerOptions = { childList: true, subtree: true, attributes: true }

    this.runReplacementScriptOnObserve = this.runReplacementScriptOnObserve.bind(this)
    this.runReplacementScriptOnClick = this.runReplacementScriptOnClick.bind(this)

    window.addEventListener('beforeunload', this.#cleanup.bind(this))
    window.addEventListener('unload', this.#cleanup.bind(this))
  }

  public update({ isEIP6963, observerOptions }: UpdateProps) {
    if (typeof isEIP6963 === 'boolean') {
      this.#isEIP6963 = isEIP6963
    }

    if (observerOptions) {
      this.#observerOptions = observerOptions
      this.#setupObserver(this.#observerOptions)
    }
  }

  public init() {
    if (blacklistedPages.some((page) => window.location.hostname.includes(page))) return

    this.#initializeReplacementTimeout = setTimeout(() => {
      if (this.#mmOccurrencesOnFirstDOMLoad === null) {
        this.runReplacementScriptOnObserve()
      }
    }, 250)

    if (!this.#clickListener) {
      this.#clickListener = document.addEventListener('click', this.runReplacementScriptOnClick)
    }
    if (!this.#observer) {
      this.#setupObserver(this.#observerOptions)
    }
  }

  // Find all shadow roots in a node
  #getAllShadowRoots(n: Node = document.body) {
    const shadowRoots: ShadowRoot[] = []

    function traverse(node: Node) {
      if (node?.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        if (element.shadowRoot) {
          shadowRoots.push(element.shadowRoot)

          for (const child of Array.from(element.shadowRoot.childNodes)) {
            traverse(child)
          }
        }
        for (const child of Array.from(element.childNodes)) {
          traverse(child)
        }
      }
    }
    traverse(n)

    return shadowRoots
  }

  #findShadowRootElementById(id: string, shadowRootsToQuery?: ShadowRoot[]) {
    for (const shadowRoot of shadowRootsToQuery || this.#getAllShadowRoots()) {
      const el = shadowRoot.getElementById(id)
      if (el) return el
    }

    return undefined
  }

  #getVisibleWordsOccurrencesInPage(
    words: string[][],
    nodeToQuery?: ParentNode,
    shadowRootsToQuery?: ShadowRoot[]
  ) {
    const results: {
      words: string[]
      count: number
      nodes: HTMLElement[]
    }[] = words.map((wordsGroup: string[]) => ({
      words: wordsGroup,
      count: 0,
      nodes: []
    }))

    const searchForWords = (node: Node | HTMLElement) => {
      const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (
            (node.parentElement?.offsetHeight || 0) > screen.height * 2 ||
            (node.parentElement?.offsetWidth || 0) > screen.width * 2
          ) {
            return NodeFilter.FILTER_REJECT
          }

          // Check if the current node is visible
          if (node.parentElement?.offsetHeight === 0 && node.parentElement?.offsetWidth === 0) {
            return NodeFilter.FILTER_REJECT
          }

          return NodeFilter.FILTER_ACCEPT
        }
      })

      while (treeWalker.nextNode()) {
        const currentNode = treeWalker.currentNode
        const textContent =
          treeWalker.currentNode.textContent?.trim() ||
          treeWalker.currentNode.parentElement?.innerText ||
          ''

        for (let i = 0; i < words.length; i++) {
          for (let j = 0; j < words[i].length; j++) {
            if (textContent.toLowerCase().includes(words[i][j].toLowerCase())) {
              results[i].count += 1
              if (currentNode.parentElement) {
                results[i].nodes.push(currentNode.parentElement)
              }
            }
          }
        }
      }
    }

    for (const shadowRoot of shadowRootsToQuery || this.#getAllShadowRoots()) {
      searchForWords(shadowRoot)
    }

    searchForWords(nodeToQuery || document.body)
    return results
  }

  #replaceIconOnlyConnectionButtons(iconName: string) {
    const imgElements = document.getElementsByTagName('img')
    for (let i = 0; i < imgElements.length; i++) {
      if (imgElements[i].src.includes(iconName)) {
        const { clientWidth, clientHeight } = imgElements[i]
        imgElements[i].src = ambireSvg
        imgElements[i].style.width = `${clientWidth}px`
        imgElements[i].style.height = `${clientHeight}px`
      }
    }
  }

  #findAndReplaceOtherWalletIconWithAmbireIcon(
    node: any,
    iconNames: string[],
    foundTextElement?: Element
  ) {
    const imgElement = node.querySelector('img')
    const svgElement = node.querySelector('svg')
    const imgElementByRole = node.querySelector('[role="img"]')
    const allDivs = node.querySelectorAll('div')

    const mmIconDivs = Array.from(allDivs).filter((div: any) => {
      const background = window.getComputedStyle(div).getPropertyValue('background')
      const backgroundImg = window.getComputedStyle(div).getPropertyValue('background-image')
      return iconNames.some((name) => background.includes(name) || backgroundImg.includes(name))
    })

    const allIconElements: { type: string; el: any }[] = [
      { type: 'img', el: imgElement },
      { type: 'svg', el: svgElement },
      { type: 'img-role', el: imgElementByRole },
      ...mmIconDivs.map((div) => ({ type: 'div', el: div }))
    ].filter((icon) => !!icon.el)

    if (allIconElements.length) {
      const findClosestIconType = (textEl?: Element) => {
        if (!textEl) return null

        const textElRect = textEl.getBoundingClientRect()
        let closestElementType = null
        let minDistance = Infinity

        allIconElements.forEach((icon) => {
          const elementRect = icon.el.getBoundingClientRect()
          const distance = Math.sqrt(
            (elementRect.x - textElRect.x) ** 2 + (elementRect.y - textElRect.y) ** 2
          )

          // Update closestElement and minDistance if the current element is closer
          if (distance < minDistance) {
            closestElementType = icon.type
            minDistance = distance
          }
        })

        return closestElementType
      }

      const closestFoundIconType =
        allIconElements.length > 1 ? findClosestIconType(foundTextElement) : null
      const newImgElement = document.createElement('img')
      newImgElement.src = ambireSvg

      if (imgElement) {
        const { clientWidth, clientHeight } = imgElement
        imgElement.src = ambireSvg
        imgElement.style.width = `${clientWidth}px`
        imgElement.style.height = `${clientHeight}px`
        imgElement.removeAttribute('srcset')

        if (closestFoundIconType === 'img') return true
      }

      if (svgElement) {
        let shouldReplace = true
        if (svgElement.clientHeight) {
          if (svgElement.clientHeight < 14) {
            shouldReplace = false
          }
          newImgElement.style.height = `${svgElement.clientHeight}px`
        }
        if (svgElement.clientWidth) {
          if (svgElement.clientWidth < 14) {
            shouldReplace = false
          }
          newImgElement.style.width = `${svgElement.clientWidth}px`
        }
        if (shouldReplace) {
          svgElement.parentNode.insertBefore(newImgElement, svgElement)
          svgElement.style.display = 'none'
        }

        if (closestFoundIconType === 'svg') return true
      }

      if (imgElementByRole) {
        let shouldReplace = true
        if (imgElementByRole.clientHeight) {
          if (imgElementByRole.clientHeight < 14) {
            shouldReplace = false
          }
          newImgElement.style.height = `${imgElementByRole.clientHeight}px`
        }
        if (imgElementByRole.clientWidth) {
          if (imgElementByRole.clientWidth < 14) {
            shouldReplace = false
          }
          newImgElement.style.width = `${imgElementByRole.clientWidth}px`
        }
        if (shouldReplace) {
          imgElementByRole.parentNode.insertBefore(newImgElement, imgElementByRole)
          imgElementByRole.style.display = 'none'
        }

        if (closestFoundIconType === 'img-role') return true
      }

      mmIconDivs.forEach((div: any) => {
        if (div.clientHeight) {
          newImgElement.style.height = `${div.clientHeight}px`
        }
        if (div.clientWidth) {
          newImgElement.style.width = `${div.clientWidth}px`
        }

        div.parentNode.insertBefore(newImgElement, div)
        div.style.display = 'none'
      })

      return true
    }

    return false
  }

  #replaceOtherWalletWithAmbireInConnectionModals(
    otherWalletNames: string[],
    nameToReplace: string,
    nodeToQuery?: ParentNode
  ) {
    let additionalNodes: any[] = []
    let isBlockNativeModal = false
    const onboardElement = (nodeToQuery || document).querySelector('onboard-v2')
    const allShadowRoots = this.#getAllShadowRoots()
    for (const shadowRoot of allShadowRoots) {
      additionalNodes = [...additionalNodes, ...Array.from(shadowRoot.querySelectorAll('*'))]
    }

    const nodes = [
      ...Array.from(
        nodeToQuery ? nodeToQuery.querySelectorAll('*') : document.querySelectorAll('body, body *')
      ),
      ...additionalNodes
    ]
    nodes.forEach((node) => {
      Array.from(node.childNodes).forEach((childNode: any) => {
        if (childNode.nodeType === Node.TEXT_NODE) {
          const text = childNode.nodeValue
          if (text.trim().toLowerCase().includes('Available Wallets'.toLowerCase())) {
            isBlockNativeModal = true
          }

          if (
            otherWalletNames.some(
              (name) =>
                text.trim().split(/\s+/).length <= 5 &&
                text.toLowerCase().trim().includes(name.toLowerCase())
            )
          ) {
            const lookForIcon = () => {
              let ancestorNode = childNode.parentNode
              let maxLevels = 4
              let shouldBreakWhileLoop = false
              while (ancestorNode && maxLevels > 0 && !shouldBreakWhileLoop) {
                maxLevels--
                const allNestedShadowRootsForAncestorNode = this.#getAllShadowRoots(ancestorNode)
                if (allNestedShadowRootsForAncestorNode.length) {
                  for (let i = 0; i < allNestedShadowRootsForAncestorNode.length; i++) {
                    const node = allNestedShadowRootsForAncestorNode[i]
                    const replaced = this.#findAndReplaceOtherWalletIconWithAmbireIcon(
                      node,
                      otherWalletNames,
                      childNode.parentElement
                    )
                    if (replaced) {
                      shouldBreakWhileLoop = true
                      break
                    }
                  }
                } else {
                  const replaced = this.#findAndReplaceOtherWalletIconWithAmbireIcon(
                    ancestorNode,
                    otherWalletNames,
                    childNode.parentElement
                  )
                  if (replaced) break
                }

                ancestorNode = ancestorNode.parentNode
              }
            }

            // For some reason the onboard-v2 lib renders wallet icons async and we should
            // wait for the MM icon to be rendered in order to find it and replace it with our own icon
            if (onboardElement || isBlockNativeModal) {
              setTimeout(
                () => {
                  lookForIcon()
                },
                isBlockNativeModal ? 1000 : 400
              )
            } else {
              lookForIcon()
            }
          }

          const replacedText = text.replace(new RegExp(nameToReplace, 'gi'), 'Ambire')

          if (text !== replacedText) {
            childNode.nodeValue = replacedText
          }
        }
      })
    })
  }

  async #replaceMetamaskInW3Modal(el: HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const key of [...Array(5).keys()]) {
      // eslint-disable-next-line no-await-in-loop
      await delayPromise(250)
      if (this.#getVisibleWordsOccurrencesInPage([['metamask']], el)[0].count) {
        return this.#replaceOtherWalletWithAmbireInConnectionModals(['metamask'], 'metamask', el)
      }
    }
  }

  #runReplacementScript(shouldUpdateShadowRoots: boolean = true) {
    if (!window.ethereum._isAmbire) return
    if (!this.doesWebpageReadOurProvider) return

    if (this.#initializeReplacementTimeout) clearTimeout(this.#initializeReplacementTimeout)

    if (shouldUpdateShadowRoots || this.#shadowRoots === null)
      this.#shadowRoots = this.#getAllShadowRoots()

    const wordsOccurrencesResult = this.#getVisibleWordsOccurrencesInPage(
      [
        ['metamask'],
        ['okx wallet'],
        ['walletconnect', 'wallet connect'],
        ['coinbasewallet', 'coinbase wallet', 'coinbase'],
        ['trustwallet', 'trust wallet']
      ],
      undefined,
      this.#shadowRoots
    )
    const mmOccurrences = wordsOccurrencesResult.filter((res) => res.words.includes('metamask'))[0]
    if (!mmOccurrences.count) return
    const okxOccurrences = wordsOccurrencesResult.filter((res) =>
      res.words.includes('okx wallet')
    )[0]
    if (this.#mmOccurrencesOnFirstDOMLoad === null) {
      this.#mmOccurrencesOnFirstDOMLoad = mmOccurrences.count
    }

    const hasMetaMaskInPage = mmOccurrences.count !== 0
    const hasOKXWalletInPage = okxOccurrences.count !== 0

    const wcOccurrences = wordsOccurrencesResult.filter((res) =>
      res.words.includes('walletconnect')
    )[0]
    const coinbaseOccurrences = wordsOccurrencesResult.filter((res) =>
      res.words.includes('coinbase')
    )[0]

    const hasWalletConnectInPage = wcOccurrences.count !== 0
    const hasCoinbaseWalletInPage = coinbaseOccurrences.count !== 0
    const hasAmbireInPage = this.#getVisibleWordsOccurrencesInPage([['ambire']])[0].count !== 0
    const doesDappSupportEIP6963 = this.#isEIP6963 && hasAmbireInPage
    ;(async () => {
      if (doesDappSupportEIP6963 && !whitelistedEIP6963Pages.includes(window.location.origin))
        return
      if (!doesDappSupportEIP6963) await delayPromise(30)
      const w3Modal = this.#findShadowRootElementById('w3m-modal')
      if (w3Modal) this.#replaceMetamaskInW3Modal(w3Modal)

      if (hasWalletConnectInPage) this.#replaceIconOnlyConnectionButtons('metamask')

      const trustWalletOccurrences = wordsOccurrencesResult.filter((res) =>
        res.words.includes('trustwallet')
      )[0]

      const hasTrustWalletInPage = trustWalletOccurrences.count !== 0

      if (!hasMetaMaskInPage && !hasOKXWalletInPage) return
      if (!(hasWalletConnectInPage || hasCoinbaseWalletInPage || hasTrustWalletInPage)) {
        return
      }

      //
      // MetaMask Button Replacement
      //

      if (hasMetaMaskInPage) {
        if (
          this.#mmOccurrencesOnFirstDOMLoad !== 0 &&
          this.#mmOccurrencesOnFirstDOMLoad === mmOccurrences.count &&
          !this.hasInteractedWithPage
        )
          return
        mmOccurrences.nodes.forEach((n) => {
          this.#replaceOtherWalletWithAmbireInConnectionModals(
            ['metamask', 'connect by metamask'],
            'metamask',
            n.parentNode as any
          )
        })
        return
      }

      //
      // OKX Wallet Button Replacement
      //

      if (!hasMetaMaskInPage && !hasAmbireInPage && hasOKXWalletInPage) {
        okxOccurrences.nodes.forEach((n) => {
          this.#replaceOtherWalletWithAmbireInConnectionModals(
            ['okx wallet', 'connect by okx wallet'],
            'okx wallet',
            n.parentNode as any
          )
        })
      }
    })()
  }

  public runReplacementScriptOnObserve() {
    this.#runReplacementScript(true)
  }

  public runReplacementScriptOnClick() {
    this.#runReplacementScript(false)
    this.hasInteractedWithPage = true
  }

  #setupObserver(options?: MutationObserverInit) {
    this.#cleanupObserver()

    if (blacklistedPages.some((page) => window.location.hostname.includes(page))) return

    this.#observer = new MutationObserver(this.runReplacementScriptOnObserve)
    this.#observer.observe(document, options)
  }

  #cleanupObserver() {
    if (this.#observer) {
      this.#observer.disconnect()
      this.#observer = null
    }
  }

  #cleanup() {
    this.#cleanupObserver()
    if (this.#clickListener) {
      document.removeEventListener('click', this.runReplacementScriptOnClick.bind(this))
    }
  }
}
