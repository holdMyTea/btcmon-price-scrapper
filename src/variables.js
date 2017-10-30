export default ['PUT_HOST', 'PUT_PORT', 'DATASET', 'INTERVAL']
.reduce((acc, val) => {
  if (process.env[val]) {
    acc[val] = process.env[val]
    return acc
  } else {
    throw new Error('Enviromental property ' + val + ' is missing')
  }
}, {})
