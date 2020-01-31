const csv = require('csvtojson')
const path = require('path')
const brownfield = path.join(__dirname, 'brownfield-land-collection/dataset/brownfield-land.csv')
const organisations = path.join(__dirname, 'organisation-collection/collection/organisation.csv')

csv().fromFile(organisations).then(async function (json) {
  const brownfieldData = await csv().fromFile(brownfield)
  const shouldPublishBrownfield = json.filter(function (row) {
    return row['organisation'].startsWith('local-authority-eng') || row['organisation'].startsWith('development-corporation') || row['organisation'].startsWith('national-park-authority')
  })
  const inBrownfield = shouldPublishBrownfield.map(function (row) {
    return {
      active: !row['end-date'].length,
      'in-brownfield': brownfieldData.filter(function (item) {
        return item['organisation'] === row['organisation']
      }),
      organisation: row['organisation'],
      name: row['name'],
      website: row['website']
    }
  }).filter(function (row) {
    return row['active'] && !row['in-brownfield'].length
  })

  console.log(JSON.stringify(inBrownfield, null, 4))
})
