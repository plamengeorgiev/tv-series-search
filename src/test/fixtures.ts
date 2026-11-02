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

// Trimmed copy of https://api.tvmaze.com/shows/1?embed[]=cast&embed[]=seasons (3 of 15 cast members).
export const showDetailsFixture = {
  ...showFixture,
  _embedded: {
    cast: [
      {
        person: {
          id: 1,
          url: 'https://www.tvmaze.com/people/1/mike-vogel',
          name: 'Mike Vogel',
          image: {
            medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/1815.jpg',
            original: 'https://static.tvmaze.com/uploads/images/original_untouched/0/1815.jpg',
          },
        },
        character: { id: 1, name: 'Dale "Barbie" Barbara' },
        self: false,
        voice: false,
      },
      {
        person: {
          id: 2,
          url: 'https://www.tvmaze.com/people/2/rachelle-lefevre',
          name: 'Rachelle Lefevre',
          image: {
            medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/82/207417.jpg',
            original: 'https://static.tvmaze.com/uploads/images/original_untouched/82/207417.jpg',
          },
        },
        character: { id: 2, name: 'Julia Shumway' },
        self: false,
        voice: false,
      },
      {
        person: {
          id: 3,
          url: 'https://www.tvmaze.com/people/3/alexander-koch',
          name: 'Alexander Koch',
          image: {
            medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/205/513325.jpg',
            original: 'https://static.tvmaze.com/uploads/images/original_untouched/205/513325.jpg',
          },
        },
        character: { id: 3, name: 'Junior Rennie' },
        self: false,
        voice: false,
      },
    ],
    seasons: [
      {
        id: 1,
        url: 'https://www.tvmaze.com/seasons/1/under-the-dome-season-1',
        number: 1,
        name: '',
        episodeOrder: 13,
        premiereDate: '2013-06-24',
        endDate: '2013-09-16',
      },
      {
        id: 2,
        url: 'https://www.tvmaze.com/seasons/2/under-the-dome-season-2',
        number: 2,
        name: '',
        episodeOrder: 13,
        premiereDate: '2014-06-30',
        endDate: '2014-09-22',
      },
      {
        id: 6233,
        url: 'https://www.tvmaze.com/seasons/6233/under-the-dome-season-3',
        number: 3,
        name: '',
        episodeOrder: 13,
        premiereDate: '2015-06-25',
        endDate: '2015-09-10',
      },
    ],
  },
} as const

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

export const sparseShowDetailsFixture = {
  ...sparseShowFixture,
  _embedded: { cast: [], seasons: [] },
}

export const searchResultsFixture = [
  { score: 0.68, show: showFixture },
  { score: 0.61, show: sparseShowFixture },
]
