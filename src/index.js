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
  const request = await axios.get(dataset.get.url)
  const data = request.data

  console.log('Time: ' + parse(data, dataset.get.timestamp) + ' Price: ' + parse(data, dataset.get.price))

  await axios.put(
    putURL,
    {
      value: Number(parse(data, dataset.get.price).replace(',', '')),
      timestamp: adjustTimeFormat(parse(data, dataset.get.timestamp), dataset.get.timeformat)
    }
  )
}

function parse (data, sequence) {
  let obj = data
  sequence.forEach((element) => obj = obj[element])
  return obj
}

function adjustTimeFormat (rawTime, timeformat) {
  if (timeformat === 'unix') {
    return rawTime * 1e3
  } else if (timeformat === 'mills') {
    return rawTime
  }
}
