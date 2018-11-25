const axios = require('axios')
const { apiEndpoint } = require('../config')

module.exports = async payload => {
  try {
    const data = await axios.post(apiEndpoint, payload)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
