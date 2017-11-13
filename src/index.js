'use strict'

import axios from 'axios'

import variables from './variables.js'

main()

async function main () {
  console.log('http://' + variables.CONFIG_HOST + ':' + variables.CONFIG_PORT + '/price-scrapper/' + variables.DATASET)
  let request

  try {
    request = await axios.get('http://' + variables.CONFIG_HOST + ':' + variables.CONFIG_PORT + '/price-scrapper/' + variables.DATASET)
  } catch (err) {
    console.log(err)
  }

  const dataset = request.data.data
  const putURL = 'http://' + variables.DB_SERVICE_HOST + ':' + variables.DB_SERVICE_PORT + '/' + request.data.name

  setInterval(dataRequest, variables.INTERVAL * 1000, putURL, dataset)
}

async function dataRequest (putURL, dataset) {
  const newRequest = await axios.get(dataset.get.url)
  const newdata = newRequest.data

  const newValue = Number(parse(newdata, dataset.get.price).replace(',', ''))
  const newTime = adjustTimeFormat(parse(newdata, dataset.get.timestamp), dataset.get.timeformat)

  const oldRequest = await axios.get(putURL + '/lastInsert')
  const oldTime = new Date(oldRequest.data).getTime()

  if (newTime > oldTime) {
    console.log('Puttin\' in new value: ' + newValue + ' at ' + newTime)
    await axios.put(
      putURL,
      {
        value: newValue,
        timestamp: newTime
      }
    )
  }
}

function parse (data, sequence) {
  let obj = data
  sequence.forEach((element) => obj = obj[element])
  return obj
}

function adjustTimeFormat (rawTime, timeformat) {
  if (timeformat === 'unix') {
    return new Date(rawTime * 1e3).getTime()
  } else if (timeformat === 'mills') {
    return new Date(rawTime).getTime()
  }
}
