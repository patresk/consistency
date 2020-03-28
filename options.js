/**
 * Format of blocked entity
 * {
 *   match: string,
 *   dailyLimit: number, (in seconds)
 *   createdAt: number,
 * }
 */

// Uncomment if you need to reset the list for some reason
// chrome.storage.sync.set({list: []})

const listElement = document.getElementById("js-list")
const textInput = document.getElementById('js-website');

function renderList() {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    list.sort((a, b) => b.createdAt - a.createdAt)
    while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
    for (let item of list) {
      let li = document.createElement('li');
      li.innerText = item.match
      const removeBtn = document.createElement('button')
      removeBtn.innerText = 'Remove'
      removeBtn.addEventListener("click", function() {
        removeItem(item)
      })
      li.appendChild(removeBtn)
      listElement.appendChild(li);
    }
  })
}

function addToList(item) {
  let li = document.createElement('li');
  li.innerText = item.match
  const removeBtn = document.createElement('button')
  removeBtn.innerText = 'Remove'
  removeBtn.addEventListener("click", function() {
    removeItem(item)
  })
  li.appendChild(removeBtn)
  li.classList.add('animated')
  listElement.insertBefore(li, listElement.firstChild)
}

function removeItem(itemToRemove) {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    const updatedList = list.filter(item => item.id !== itemToRemove.id)
    chrome.storage.sync.set({list: updatedList}, function() {
      renderList()
    })
  })
}

function addItem(item) {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    list.push(item)
    chrome.storage.sync.set({list: list}, function() {
      // renderList()
      addToList(item)
    })
  })
}

textInput.addEventListener('keyup', function(e) {
  if (e.keyCode === 13) {
    addItem({
      id: Date.now(),
      match: textInput.value,
      createdAt: Date.now(),
      dailyLimit: 0
    })
    textInput.value = ''
  }
})

renderList()
textInput.focus()
