chrome.storage.sync.get('list', function(data) {
  const list = data.list || []
  const blocked = list.find(item => location.origin.includes(item.match))

  if (blocked) {
    list[list.indexOf(blocked)].blockCount = (list[list.indexOf(blocked)].blockCount || 0) + 1
    chrome.storage.sync.set({list})
    location.replace(chrome.extension.getURL("nono.html"))
  }
});