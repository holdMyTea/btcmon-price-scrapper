'use strict'

import axios from 'axios'

import config from './config.json'

func()

async function func () {
  let request = await axios.get(config.get.url)
  const data = request.data

  console.log('Price: ' + parse(data, config.price))
  console.log('Time: ' + parse(data, config.timestamp))

  let response = await axios.put(
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

/* works with db-service */
