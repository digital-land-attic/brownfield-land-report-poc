# Brownfield Land Report (proof of concept)

## Installation

1. [Node >=10](https://nodejs.org) and [NPM](https://npmjs.com)
1. `git clone --remote` this repository
1. `cd` into the directory
1. Run `npm install`
1. Run `git submodule update --remote` to ensure you have the latest version of the [brownfield-land-collection](https://github.com/digital-land/brownfield-land-collection)

## Generating statistics
Run:
`node index.js > ./results/index.json`
`node organisation.js > ./results/organisation.json`
`node ping.js > ./results/ping.json`

Results will be in JSON files in ./results

## Calculations
This outputs:

- active_count - how many rows have a start-date but no end-date
- datasets
  - average_alive_length - a calculation of the average number of days between a start-date and end-date. if the end-date is blank, it uses today's date
- oldest
  - active - the row that has a start-date but no end date that is the oldest start-date
  - inactive - the row that has a start-date and an end-date that has the oldest start-date
  - overall - the row that has a start-date and might have an end-date that has the oldest start-date
- organisations
  - count - how many rows that have a different organisation key
  - active_count - how many rows have a different organisation key and a start-date
  - inactive_count - how many rows have a diffeerent organisation key, start-date, and end-date
