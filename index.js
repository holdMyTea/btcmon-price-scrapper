'use strict'

import axios from 'axios'

import config from './config.json'

setInterval(func, config.interval * 1000)

async function func () {
  console.log('Func started: ' + new Date().toLocaleString())

  let request = await axios.get(config.get.url)
  const data = request.data

  console.log('Price: ' + parse(data, config.get.price))
  console.log('Time: ' + parse(data, config.get.timestamp))

  await axios.put(
    config.put.url,
    {
      value: Number(parse(data, config.get.price).replace(',', '')),
      timestamp: parse(data, config.get.timestamp)
    }
  )
}

function parse (data, sequence) {
  let obj = data
  sequence.forEach((element) => obj = obj[element])
  return obj
}
