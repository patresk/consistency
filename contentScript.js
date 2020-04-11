chrome.storage.sync.get('list', function(data) {
  const list = data.list || []
  const match = list.find(item => location.origin.includes(item.match))

  // If this website is not blocked, do nothing
  if (!match) {
    return
  }

  // If only homepage is blocked and user is accessing a subpage, do nothing
  if (!!match.homepageOnly && location.pathname !== '/') {
    return
  }

  // Otherwise block the access
  list[list.indexOf(match)].blockCount = (list[list.indexOf(match)].blockCount || 0) + 1
  chrome.storage.sync.set({list})
  location.replace(chrome.extension.getURL("nono.html"))
});