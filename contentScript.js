const WAIT_TIME = 1000 * 30 // User has to wait for 30 seconds before accessing a page
const ALLOWED_TIME = 1000 * 60 * 30 // The user is allowed to access the page for 30 minutes

chrome.storage.sync.get('list', function(data) {
  const originalUrl = location.href

  const list = data.list || []
  const match = list.find(item => location.origin.includes(item.match))

  // If this website is not blocked, let them in
  if (!match) {
    return
  }

  // If only homepage is blocked and user is accessing a subpage, let them in
  if (!!match.homepageOnly && location.pathname !== '/') {
    return
  }

  // If the page can be temporarily accessed (the user waited long enough), let them in
  if (match.timer && match.temporarilyAllowedFrom) {
    if (match.temporarilyAllowedFrom <= Date.now() && Date.now() <= match.temporarilyAllowedFrom + ALLOWED_TIME) {
      return
    }
  }

  // Update the counter of how many times the website has been blocked
  match.blockCount = (match.blockCount || 0) + 1

  // If the page is protected by a timer, set it
  if (match.timer) {
    // If a valid timer already exists but it's old, remove it
    if (match.temporarilyAllowedFrom && match.temporarilyAllowedFrom < Date.now() - ALLOWED_TIME) {
      match.temporarilyAllowedFrom = undefined
    }

    if (!match.temporarilyAllowedFrom) {
      match.temporarilyAllowedFrom = Date.now() + WAIT_TIME
    }
  }

  chrome.storage.sync.set({list})

  // Show the blocker page, either with a timer or without
  if (match.timer) {
    location.replace(`${chrome.extension.getURL("nono.html")}?waitUntil=${match.temporarilyAllowedFrom}&continueTo=${encodeURIComponent(originalUrl)}`)
  } else {
    location.replace(chrome.extension.getURL("nono.html"))
  }
});