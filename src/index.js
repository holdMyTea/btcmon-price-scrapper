'use strict'

import axios from 'axios'

import variables from './variables.js'
import raw from './data.json'

const dataset = raw[variables.DATASET]

const putURL = 'http://' + variables.PUT_HOST + ':' + variables.PUT_PORT + '/' + dataset.put.collection
console.log('Put url: ' + putURL)

setInterval(func, variables.INTERVAL * 1000)

async function func () {
  console.log('Func started: ' + new Date().toLocaleString())

  let request = await axios.get(dataset.get.url)
  const data = request.data

  console.log('Price: ' + parse(data, dataset.get.price))
  console.log('Time: ' + parse(data, dataset.get.timestamp))

  await axios.put(
    putURL,
    {
      value: Number(parse(data, dataset.get.price).replace(',', '')),
      timestamp: parse(data, dataset.get.timestamp)
    }
  )
}

function parse (data, sequence) {
  let obj = data
  sequence.forEach((element) => obj = obj[element])
  return obj
}
