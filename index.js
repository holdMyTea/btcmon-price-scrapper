'use strict'

import axios from 'axios'

import config from './config.json'

func()

async function func () {
  let request = await axios.get(config.url)
  const data = request.data

  console.log('Price: ' + parse(data, config.price))
  console.log('Time: ' + parse(data, config.timestamp))

  let response = await axios.put(
    'http://localhost:8080/test',
    {
      value: parse(data, config.price),
      timestamp: parse(data, config.timestamp)
    }
  )

}

function parse (data, sequence) {
  let obj = data
  sequence.forEach((element) => obj = obj[element])
  return obj
}
