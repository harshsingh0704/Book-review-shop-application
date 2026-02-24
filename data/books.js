// Sample books data preloaded
// Each book has: isbn, title, author, optional metadata, reviews (object mapping username -> review)
const books = {
  "9780143127741": {
    isbn: "9780143127741",
    title: "The Alchemist",
    author: "Paulo Coelho",
    year: 1993,
    publisher: "HarperOne",
    pages: 208,
    reviews: {
      alice: "A magical fable about following your dreams.",
    },
  },
  "9780553386790": {
    isbn: "9780553386790",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: 2013,
    publisher: "Farrar, Straus and Giroux",
    pages: 512,
    reviews: {
      bob: "Deep and insightful. Slow to digest but worthwhile.",
    },
  },
  "9780679783268": {
    isbn: "9780679783268",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 2000,
    publisher: "Vintage Classics",
    pages: 279,
    reviews: {},
  },
  "9780140449136": {
    isbn: "9780140449136",
    title: "Meditations",
    author: "Marcus Aurelius",
    year: 2006,
    publisher: "Penguin Classics",
    pages: 304,
    reviews: {},
  },
  "9781451673319": {
    isbn: "9781451673319",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    year: 2012,
    publisher: "Simon & Schuster",
    pages: 208,
    reviews: {},
  },
  "9780385543767": {
    isbn: "9780385543767",
    title: "The Midnight Library",
    author: "Matt Haig",
    year: 2020,
    publisher: "Viking",
    pages: 304,
    reviews: {},
  },
  "9780143127550": {
    isbn: "9780143127550",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2015,
    publisher: "Harper",
    pages: 498,
    reviews: {},
  },
};

module.exports = books;
