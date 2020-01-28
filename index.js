const csv = require('csvtojson')
const path = require('path')
const dataset = path.join(__dirname, 'brownfield-land-collection/dataset/brownfield-land.csv')

const functions = {
  filter: {
    active (row) {
      return row['start-date'] && !row['end-date']
    },
    inactive (row) {
      return row['start-date'] && row['end-date']
    }
  },
  map: {
    organisation_name (row) {
      return row.organisation
    }
  },
  count: {
    unique (array) {
      return [...new Set(array)].length
    }
  }
}

csv().fromFile(dataset).then(json => {
  return {
    active_count: json.filter(functions.filter.active).length,
    datasets: {
      average_alive_length: (() => {
        const hasStart = json.filter(function (row) {
          return row['start-date'].length
        })

        return hasStart.map(function (row) {
          const sd = row['start-date'].length ? new Date(row['start-date'].replace(/-/g, '/')) : new Date()
          const ed = row['end-date'].length ? new Date(row['end-date'].replace(/-/g, '/')) : new Date()

          return ((ed.getTime() - sd.getTime()) / (1000 * 3600 * 24) < 0) || (ed.getTime() - sd.getTime()) / (1000 * 3600 * 24)
        }).reduce((a, b) => {
          return a + b
        }, 0) / (hasStart.length)
      })()
    },
    oldest: {
      active: json.filter(functions.filter.active).sort((a, b) => {
        const today = new Date().toISOString().split('T')[0]

        if (!a['start-date'].length) {
          a['start-date'] = today
        }

        if (!b['start-date'].length) {
          b['start-date'] = today
        }

        return new Date(a['start-date']) - new Date(b['start-date'])
      }).find(row => {
        return row['start-date']
      }),
      inactive: json.filter(functions.filter.inactive).sort((a, b) => {
        const today = new Date().toISOString().split('T')[0]

        if (!a['start-date'].length) {
          a['start-date'] = today
        }

        if (!b['start-date'].length) {
          b['start-date'] = today
        }

        return new Date(a['start-date']) - new Date(b['start-date'])
      }).find(row => {
        return row['start-date']
      }),
      overall: json.filter(row => {
        return row['start-date']
      }).sort((a, b) => {
        const today = new Date().toISOString().split('T')[0]

        if (!a['start-date'].length) {
          a['start-date'] = today
        }

        if (!b['start-date'].length) {
          b['start-date'] = today
        }

        return new Date(a['start-date']) - new Date(b['start-date'])
      }).find(row => {
        return row['start-date']
      })
    },
    organisations: {
      count: (() => {
        const organisations = json.map(functions.map.organisation_name)
        return functions.count.unique(organisations)
      })(),
      active_count: (() => {
        const organisations = json.filter(functions.filter.active).map(functions.map.organisation_name)
        return functions.count.unique(organisations)
      })(),
      inactive_count: (() => {
        const organisations = json.filter(functions.filter.inactive).map(functions.map.organisation_name)
        return functions.count.unique(organisations)
      })()
    }
  }
}).then(result => {
  console.log(result)
})
