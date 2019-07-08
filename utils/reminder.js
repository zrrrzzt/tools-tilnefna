(async () => {
  const csv = require('csvtojson')
  const { readdir } = require('fs').promises
  const isCsv = file => file.endsWith('.csv')
  const repackJob = require('../lib/repack-reminder-job')
  const sendMessage = require('../lib/send-message')
  const files = await readdir('data')
  const file = files.filter(isCsv)[0]
  const generateMessage = data => {
    return `Velkommen til årsmøte for Rødt Notodden onsdag 13. mars kl 19 - 21 på "Huset vårt", Storgata 81. Det blir servering av mat. Håper vi sees.`
  }
  if (file) {
    console.log(`Got job: ${file}`)
    const data = await csv().fromFile(`data/${file}`)
    console.log(`Got data: ${data.length} entries`)
    let jobs = data
      .filter(line => line.member !== 'ja')
      .filter(line => line.phone !== '')
      .map(line => Object.assign({}, line, { message: generateMessage(line) }))
      .map(repackJob)
    console.log(`Got jobs: ${jobs.length}`)

    const next = async () => {
      if (jobs.length > 0) {
        const job = jobs.pop()
        console.log(`Got job - ${jobs.length} - left`)
        const result = await sendMessage(job)
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
