(async () => {
  const csv = require('csvtojson')
  const { readdir } = require('fs').promises
  const isCsv = file => file.endsWith('.csv')
  const repackJob = require('./lib/repack-job')
  const sendJob = require('./lib/send-job')
  const { replyToNumber } = require('./config')
  const files = await readdir('data')
  const file = files.filter(isCsv)[0]
  if (file) {
    console.log(`Got job: ${file}`)
    const data = await csv().fromFile(`data/${file}`)
    console.log(`Got data: ${data.length} entries`)
    let jobs = data
      .filter(line => line.SMS.toLowerCase() === 'ja')
      .filter(line => line.Mobil !== '')
      .map(line => Object.assign({}, line, { replyToNumber: replyToNumber }))
      .map(repackJob)
    console.log(`Got jobs: ${jobs.length}`)
    const next = async () => {
      if (jobs.length > 0) {
        const job = jobs.pop()
        console.log(`Got job - ${jobs.length} - left`)
        const result = await sendJob(job)
        console.log('Job done')
        console.log(result)
        await next()
      } else {
        console.log(`All jobs done - finished`)
      }
    }
    await next()
  } else {
    console.log(`Nothing to do`)
  }
})()
