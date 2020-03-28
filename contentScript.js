
chrome.storage.sync.get('list', function(data) {
  const list = data.list || []

  if (list.find(item => location.origin.includes(item.match))) {
    location.replace(chrome.extension.getURL("nono.html"))
  }
});