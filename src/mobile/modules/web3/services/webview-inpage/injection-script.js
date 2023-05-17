import RNFS from 'react-native-fs'
import networks from 'ambire-common/src/constants/networks'

import { useEffect, useState } from 'react'
// TODO: fix path
import { DAPP_PROVIDER_URLS } from '@web/extension-services/inpage/config/dapp-providers'
import { isiOS } from '@common/config/env'
import eventEmitterScript from './EventEmitterScript'
import ambireSvg from './ambire-svg-script'

// TODO: Wire up to Ambire setting "behave like MetaMask"
const IS_METAMASK = true

const commonScript = `
  ${eventEmitterScript}

  function replaceMetamaskWithAmbire(textToFind, replacementText) {
    document.querySelectorAll('body, body *').forEach(node => {
      Array.from(node.childNodes).forEach(childNode => {
        if (childNode.nodeType === Node.TEXT_NODE) {
          const text = childNode.nodeValue;
          const replacedText = text.replace(new RegExp(textToFind, 'gi'), replacementText);

          if (text.toLowerCase().includes(textToFind.toLowerCase())) {
            let ancestorNode = childNode.parentNode;
            let maxLevels = 4;
            while (ancestorNode && maxLevels > 0) {
              maxLevels--;
              const imgElements = ancestorNode.querySelectorAll('img');
              if (imgElements.length > 0) {
                const imgElement = document.createElement('img');
                imgElement.src = "${ambireSvg}";
                imgParent = imgElements[0].parentNode;
                imgParent.insertBefore(imgElement, imgParent.firstChild);
                imgElements[0].remove()

                break;
              }

              const svgElements = ancestorNode.querySelectorAll('svg');
              if (svgElements.length > 0) {
                const imgElement = document.createElement('img');
                imgElement.src = "${ambireSvg}";
                svgParent = svgElements[0].parentNode;
                svgParent.insertBefore(imgElement, svgParent.firstChild);
                svgElements[0].remove();

                break;
              }

              ancestorNode = ancestorNode.parentNode;
            }
          }

          childNode.nodeValue = replacedText;
        }
      });
    });
  };

  let timeoutId;
  const observer = new MutationObserver((mutationsList) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ mutation: mutationsList[mutationsList.length - 1] }));
    }, 80);
  });
  observer.observe(document, { childList: true, subtree: true });

  const networks = ${JSON.stringify(networks)};
  const DAPP_PROVIDER_URLS = ${JSON.stringify(DAPP_PROVIDER_URLS)};
  const IS_METAMASK = ${IS_METAMASK};
`

const useGetProviderInjection = () => {
  const [provider, setProvider] = useState('')

  useEffect(() => {
    isiOS
      ? RNFS.readFile(`${RNFS.MainBundlePath}/EthereumProvider.js`, 'utf8')
          .then((ethereumProviderScript) => {
            setProvider(`
            ${commonScript}
            ${ethereumProviderScript}
          `)
          })
          .catch((error) => {
            console.error(`Error reloading ${`${RNFS.MainBundlePath}/EthereumProvider.js`}:`, error)
          })
      : RNFS.readFileAssets('EthereumProvider.js', 'utf8')
          .then((ethereumProviderScript) => {
            setProvider(`
            ${commonScript}
            ${ethereumProviderScript}
          `)
          })
          .catch((error) => {
            console.error('Error reloading EthereumProvider.js:', error)
          })
  }, [])

  return {
    script: provider
  }
}

export default useGetProviderInjection
