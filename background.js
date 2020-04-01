// chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.sync.set({list: []}, function() {
  //   //
  // });
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  //   chrome.declarativeContent.onPageChanged.addRules([{
  //     conditions: [new chrome.declarativeContent.PageStateMatcher({
  //       pageUrl: {hostEquals: 'developer.chrome.com'},
  //     })
  //     ],
  //     actions: [new chrome.declarativeContent.ShowPageAction()]
  //   }]);
  // })
// });

/**
 * Holds current active tab ID - useful when calculating "time spent" on websites
 * This implementation does not take into account multiple opened browser windows.
 */
let activeTabId = null
let activeTabUrl = null
let activeTabInitAt = null

const allowedProtocols = ['http:', 'https:']

function getHost(url) {
  return new URL(url).hostname
}

function isUrlAllowed(url) {
  return allowedProtocols.includes(new URL(url).protocol)
}

chrome.tabs.onActivated.addListener(function ({ tabId }) {
  console.log('on activated', tabId)
  console.log('state', activeTabId, activeTabUrl, activeTabInitAt)
  chrome.tabs.get(tabId, function(tab) {
    activeTabUrl = getHost(tab.url)
  })
  if (activeTabId !== tabId) {
    logSession(activeTabUrl, new Date() - activeTabInitAt)
    activeTabId = tabId
    activeTabUrl = null
    activeTabInitAt = new Date()
  }
  console.log('state after', activeTabId, activeTabUrl, activeTabInitAt)
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('on updated', tabId)
  console.log('state before', activeTabId, activeTabUrl, activeTabInitAt)
  if (tabId === activeTabId) {
    const activeUrl = getHost(tab.url)
    if (activeUrl !== activeTabUrl) {
      logSession(activeTabUrl, new Date() - activeTabInitAt)
      if (isUrlAllowed(tab.url)) {
        activeTabUrl = activeUrl
        activeTabInitAt = new Date()
      }
    }
  }
  console.log('state after', activeTabId, activeTabUrl, activeTabInitAt)
})

chrome.tabs.onRemoved.addListener(function (tabId) {
  console.log('on removed', tabId)
  console.log('state', activeTabId, activeTabUrl, activeTabInitAt)
  if (tabId === activeTabId && activeTabUrl && activeTabInitAt) {
    logSession(activeTabUrl, new Date() - activeTabInitAt)
    activeTabId = null
    activeTabUrl = null
    activeTabInitAt = null
  }
  console.log('state after', activeTabId, activeTabUrl, activeTabInitAt)
})

function logSession(url, duration) {
  // Storage efficient implementation - store only cumulative values
  console.log("logging session", url, duration)
  if (!url) {
    console.warn("invalid session url:", url)
    return
  }
  chrome.storage.sync.get('sessions', function(data) {
    const sessions = data.sessions || {}
    sessions[url] = (sessions[url] || 0) + duration
    chrome.storage.sync.set({sessions})
  })
}

// Clear sessions
chrome.storage.sync.set({sessions: {}})