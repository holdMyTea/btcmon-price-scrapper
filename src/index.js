'use strict'

import axios from 'axios'
import moment from 'moment'

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
  const dbURL = 'http://' + variables.DB_SERVICE_HOST + ':' + variables.DB_SERVICE_PORT + '/' + request.data.name

  setInterval(dataRequest, variables.INTERVAL * 1000, dbURL, dataset)
}

async function dataRequest (dbURL, dataset) {
  const newRequest = await axios.get(dataset.get.url)
  const newdata = newRequest.data

  const newValue = Number(parse(newdata, dataset.get.price).replace(',', ''))
  const newTime = getTime(parse(newdata, dataset.get.timestamp))

  const oldRequest = await axios.get(dbURL + '/lastInsert')
  const oldTime = moment(oldRequest.data)

  if (newTime.isAfter(oldTime)) {
    console.log('Puttin\' in new value: ' + newValue + ' at ' + newTime)
    await axios.put(
      dbURL,
      {
        value: newValue,
        timestamp: newTime.format()
      }
    )
  }
}

function parse (data, sequence) {
  let obj = data
  sequence.forEach(element => obj = obj[element])
  return obj
}

function getTime (parsedValue) {
  if (parsedValue.length === 10) {
    return moment(Number(parsedValue * 1000))
  } else return moment(parsedValue)
}
