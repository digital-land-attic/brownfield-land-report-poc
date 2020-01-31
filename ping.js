const axios = require('axios')
const csv = require('csvtojson')
const path = require('path')
const dataset = path.join(__dirname, 'brownfield-land-collection/dataset/brownfield-land.csv')

const testUrl = async url => axios.get(url, {
  timeout: 10000,
  validateStatus (status) {
    return true
  }
}).then(pass => ({
  status: pass.status
})).catch(error => {
  if (error) {
    return { status: 'error' }
  }
})

csv().fromFile(dataset).then(async json => Promise.all(json.filter(item => item['resource-url'].length).map(async item => {
  const res = await testUrl(item['resource-url'])
  return {
    status: res.status,
    'resource-url': item['resource-url'],
    organisation: item['organisation'],
    'end-date': item['end-date']
  }
}))).then(done => {
  const obj = {}

  done.forEach(item => {
    obj[item['organisation']] = {
      success: {
        count: 0,

        urls: []
      },
      fail: {
        count: 0,
        urls: []
      }
    }
  })

  done.forEach(item => {
    let key = 'fail'
    if (item.status === 200) {
      key = 'success'
    }
    obj[item['organisation']][key].urls.push({ url: item['resource-url'], 'end-date': item['end-date'] })
  })

  Object.keys(obj).forEach(key => {
    obj[key].success.count = obj[key].success.urls.length
    obj[key].success.countEndDate = obj[key].success.urls.filter(url => url['end-date'].length).length
    obj[key].fail.count = obj[key].fail.urls.length
  })

  let endCount = 0
  Object.keys(obj).forEach(key => {
    endCount = endCount + obj[key].success.countEndDate
  })

  console.log(JSON.stringify(obj, null, 4))
  console.log('Total number of URLs with an end-date that were successful:', endCount)
}).catch(error => {
  console.log('error', error)
})
