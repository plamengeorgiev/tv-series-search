// Trimmed copy of a real TVmaze API response (https://api.tvmaze.com/shows/1).
// Fields the app doesn't use (url, type, runtime...) are kept to make sure they're stripped.
export const showFixture = {
  id: 1,
  url: 'https://www.tvmaze.com/shows/1/under-the-dome',
  name: 'Under the Dome',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Science-Fiction', 'Thriller'],
  status: 'Ended',
  runtime: 60,
  premiered: '2013-06-24',
  ended: '2015-09-10',
  officialSite: 'http://www.cbs.com/shows/under-the-dome/',
  rating: { average: 6.6 },
  network: {
    id: 2,
    name: 'CBS',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
  },
  webChannel: null,
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/610/1525272.jpg',
    original: 'https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg',
  },
  summary:
    '<p><b>Under the Dome</b> is the story of a small town that is suddenly and inexplicably sealed off from the rest of the world by an enormous transparent dome.</p>',
}

// Made up worst case: every optional field is empty. Real shows rarely have more than 7 of them null.
export const sparseShowFixture = {
  id: 99999,
  name: 'Unknown Pilot',
  language: null,
  genres: [],
  status: 'Ended',
  premiered: null,
  ended: null,
  officialSite: null,
  rating: { average: null },
  network: null,
  webChannel: null,
  image: null,
  summary: null,
}

export const searchResultsFixture = [
  { score: 0.68, show: showFixture },
  { score: 0.61, show: sparseShowFixture },
]
