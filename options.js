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
const textInput = document.getElementById('js-website')

const listItemTemplate = document.getElementById('template-list-item')

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
      const el = listItemTemplate.content.cloneNode(true)
      el.querySelector('.list-item_website').innerText = item.match
      el.querySelector('.list-item_count').innerText = item.blockCount ? `${item.blockCount}x blocked` : ''
      el.querySelector('.list-item_homepage').innerText = item.homepageOnly ? 'Only homepage' : `Whole domain`
      el.querySelector('.list-item_homepage').addEventListener("click", () => { updateItem(item, !item.homepageOnly, item.timer) })
      el.querySelector('.list-item_timer').innerText = item.timer ? 'Wait 30s' : `Block`
      el.querySelector('.list-item_timer').addEventListener("click", () => { updateItem(item, item.homepageOnly, !item.timer) })
      el.querySelector('.list-item_button').addEventListener("click", () => { removeItem(item) })
      listElement.appendChild(el);
    }
  })
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
    const alreadyContains = list.find(i => i.match === item.match)
    if (alreadyContains) {
      alert("You've already blocked " + item.match)
    } else {
      list.push(item)
      chrome.storage.sync.set({list: list}, function() {
        renderList()
      })
    }
  })
}

function updateItem(itemToUpdate, homepageOnly, timer) {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    const itemInList = list.find(item => item.id === itemToUpdate.id)
    itemInList.homepageOnly = homepageOnly
    itemInList.timer = timer
    chrome.storage.sync.set({list: list}, function() {
      renderList()
    })
  })

}

textInput.addEventListener('keyup', function(e) {
  if (e.keyCode === 13 && textInput.value.length > 0) {
    addItem({
      id: Date.now(),
      match: textInput.value,
      createdAt: Date.now(),
      dailyLimit: 0,
      timer: true,
    })
    textInput.value = ''
  }
})

renderList()
textInput.focus()
