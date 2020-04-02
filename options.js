/**
 * Format of a "blocked entity"
 * {
 *   match: string,
 *   blockCount: number,
 *   createdAt: number,
 * }
 */

// Uncomment if you need to reset the list for some reason
// chrome.storage.sync.set({list: []})

const listHeaderElement = document.getElementById('js-list-header')
const listElement = document.getElementById("js-list")
const textInput = document.getElementById('js-website');

function toggleHeader(toggle) {
  if (toggle) {
    listHeaderElement.classList.remove('hidden')
  } else {
    listHeaderElement.classList.add('hidden')
  }
}

function renderList() {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    list.sort((a, b) => b.createdAt - a.createdAt)
    while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
    toggleHeader(list.length > 0)
    for (let item of list) {
      let li = document.createElement('li');
      li.innerText = item.match
      if (item.blockCount) {
        let blockedEl = document.createElement('small')
          blockedEl.innerText = '(' + item.blockCount + 'x blocked)'
        li.appendChild(blockedEl)
      }
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
  toggleHeader(true)
}

function removeItem(itemToRemove) {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    const updatedList = list.filter(item => item.id !== itemToRemove.id)
    toggleHeader(updatedList.length > 0)
    chrome.storage.sync.set({list: updatedList}, function() {
      renderList()
    })
  })
}

function addItem(item) {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    const alreadyContains = list.find(i => i.match === item.match)
    if (alreadyContains) {
      alert("You've already blocked " + item.match)
    } else {
      list.push(item)
      chrome.storage.sync.set({list: list}, function() {
        addToList(item)
      })
    }
  })
}

textInput.addEventListener('keyup', function(e) {
  if (e.keyCode === 13 && textInput.value.length > 0) {
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
