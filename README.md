# Tech screening test

## Installation

```bash
git clone https://github.com/Lifeuser/fill.git
cd fill
yarn install
export FILLOUT_API_FORMS_BASE_URL=https://api.fillout.com/v1/api/forms
export FILLOUT_API_KEY=XXX
export FILLOUT_DEFAULT_LIMIT=150
yarn test
yarn start
curl --request GET \
  --url 'http://localhost:3001/cLZojxk94ous/filteredResponses?afterDate=2024-02-26T20%3A49%3A43.783Z&limit=2&offset=2&filters=%5B%7B%22id%22%3A%22dSRAe3hygqVwTpPK69p5td%22%2C%22condition%22%3A%22greater_than%22%2C%22value%22%3A%221999-02-02T05%3A01%3A47.691Z%22%7D%5D&='
```

## Development

Runs tsx (https://github.com/privatenumber/tsx) in watch mode.

```bash
yarn dev
```
