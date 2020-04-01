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
const sessionsElement = document.getElementById('sessions-list')
const textInput = document.getElementById('js-website');
const resetButton = document.getElementById('js-reset-statistics')

function renderSessions() {
  chrome.storage.sync.get('sessions', function(data) {
    const sessions = Object.entries(data.sessions || {})

    while (sessionsElement.firstChild) {
      sessionsElement.removeChild(sessionsElement.firstChild);
    }

    for (let [url, duration] of sessions.sort((a, b) => b[1] - a[1])) {
      console.log(url, duration)
      let li = document.createElement('li');
      li.innerText = url
      const durationSpan = document.createElement('span')
      durationSpan.style.paddingLeft = '10px'
      durationSpan.innerText = luxon.Duration.fromMillis(duration).as('seconds') + 's'
      li.appendChild(durationSpan)
      sessionsElement.appendChild(li);
    }
  })
}

function renderList() {
  chrome.storage.sync.get('list', function(data) {
    const list = data.list || []
    console.log(list)
    list.sort((a, b) => b.createdAt - a.createdAt)
    while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
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

resetButton.addEventListener('click', function() {
  if (confirm("Are you sure?")) {
    chrome.storage.sync.set({ sessions: {} })
    renderSessions()
  }
})

renderList()
renderSessions()
textInput.focus()
