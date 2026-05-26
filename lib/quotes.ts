export const inspirationalQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    role: "Co-founder, Apple"
  },
  {
    quote: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    role: "Co-founder, Apple"
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    role: "Management Consultant"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    role: "Former Prime Minister"
  },
  {
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    role: "Former President, South Africa"
  },
  {
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    role: "Theoretical Physicist"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    role: "Former First Lady"
  },
  {
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    role: "Musician & Songwriter"
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    role: "Hockey Legend"
  },
  {
    quote: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford",
    role: "Founder, Ford Motor Company"
  },
  {
    quote: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    role: "Former US President"
  },
  {
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    role: "Former US President"
  },
  {
    quote: "If you want to lift yourself up, lift up someone else.",
    author: "Booker T. Washington",
    role: "Educator & Author"
  },
  {
    quote: "The mind is everything. What you think you become.",
    author: "Buddha",
    role: "Spiritual Teacher"
  },
  {
    quote: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
    role: "Theoretical Physicist"
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    role: "Inventor"
  },
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    role: "Traditional Wisdom"
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    role: "Co-founder, Apple"
  },
  {
    quote: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    role: "Real Estate Developer"
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    role: "Philosopher"
  },
  {
    quote: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    role: "Poet & Philosopher"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    role: "Former US President"
  },
  {
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    role: "Philosopher"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    role: "Founder, The Walt Disney Company"
  },
  {
    quote: "If you look at what you have in life, you'll always have more.",
    author: "Oprah Winfrey",
    role: "Media Executive & Philanthropist"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    role: "Humorist & Writer"
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    role: "Author"
  },
  {
    quote: "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.",
    author: "Jimmy Dean",
    role: "Singer & Entrepreneur"
  },
  {
    quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    role: "Poet & Philosopher"
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    role: "Author"
  },
  {
    quote: "The question isn't who is going to let me; it's who is going to stop me.",
    author: "Ayn Rand",
    role: "Author & Philosopher"
  },
  {
    quote: "We cannot solve problems with the kind of thinking we employed when we came up with them.",
    author: "Albert Einstein",
    role: "Theoretical Physicist"
  }
]

// Function to get quote based on time of day (changes 4 times daily)
export function getQuoteOfTheDay() {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const hour = now.getHours()
  
  // Divide day into 4 periods: 0-6, 6-12, 12-18, 18-24
  const period = Math.floor(hour / 6)
  
  // Use day of year and period to select quote
  const index = (dayOfYear * 4 + period) % inspirationalQuotes.length
  return inspirationalQuotes[index]
}

// Get the next refresh time
export function getNextRefreshTime() {
  const now = new Date()
  const hour = now.getHours()
  const nextPeriodHour = (Math.floor(hour / 6) + 1) * 6
  
  if (nextPeriodHour >= 24) {
    // Next day at midnight
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }
  
  const nextRefresh = new Date(now)
  nextRefresh.setHours(nextPeriodHour, 0, 0, 0)
  return nextRefresh
}
