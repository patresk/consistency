const quotes = [
  "Professionals stick to the schedule; amateurs let life get in the way.",
  "You don't have to be the victim of your environment. You can also be the architect of it",
  "Every action you take is a vote for the type of person you wish to become",
  "Habits are the compound interest of self-improvement"
]
const quote = quotes[Math.floor(Math.random() * quotes.length)]
document.getElementById('js-header').innerText = '"' + quote + '"'