const axios = require('axios')
const { apiMessageEndpoint } = require('../config')

module.exports = async payload => {
  try {
    const { data } = await axios.post(apiMessageEndpoint, payload)
    return data
  } catch (error) {
    console.error(error)
    return { success: false, error: error.message }
  }
}
