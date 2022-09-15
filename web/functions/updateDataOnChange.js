const updateData = () => {
  updateExtensionIcon(message.fromTabId)

  isStorageLoaded().then(() => {
    for (const tabId in TAB_INJECTIONS) {
      sendMessage(
        {
          to: 'pageContext',
          toTabId: tabId * 1,
          type: 'ambireWalletConnected',
          data: {
            chainId: message.data.chainId,
            account: message.data.account
          }
        },
        { ignoreReply: true }
      )
      updateExtensionIcon(tabId * 1)
    }
  })
}
