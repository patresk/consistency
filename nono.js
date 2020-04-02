const quotes = [
  "Professionals stick to the schedule; amateurs let life get in the way.",
  "You don't have to be the victim of your environment. You can also be the architect of it.",
  "Every action you take is a vote for the type of person you wish to become.",
  "Habits are the compound interest of self-improvement.",
  "We often dismiss small changes because they don't seem to matter very much in the moment.",
  "Time magnifies the margin between success and failure. It will multiply whatever you feed it. Good habits make time your ally. Bad habits make time your enemy.",
  "Decide the type of person you want to be. Prove it to yourself with small wins.",
  "Before we can effectively build new habits, we need to get a handle on our current ones.",
  "The human brain evolved to prioritize immediate rewards over delayed rewards.",
  "Your outcomes are a lagging measure of your habits.",
  "A good player works hard to win the game everyone else is playing. A great player creates a new game that favors their strengths and avoids their weaknesses.",
  "The secret to getting results that last is to never stop making improvements. It's remarkable what you can build if you just don't stop.",
  "Decide the type of person you want to be. Prove it to yourself with small wins."
]
const quote = quotes[Math.floor(Math.random() * quotes.length)]
document.getElementById('js-header').innerText = quote