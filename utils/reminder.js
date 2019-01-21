(async () => {
  const csv = require('csvtojson')
  const { readdir } = require('fs').promises
  const isCsv = file => file.endsWith('.csv')
  const repackJob = require('../lib/repack-reminder-job')
  const sendMessage = require('../lib/send-message')
  const files = await readdir('data')
  const file = files.filter(isCsv)[0]
  const message = `Hei :-)
  For en stund siden spurte vi deg om du kunne tenke deg å stå på listen for Rødt Notodden til kommunevalget 2019. Har du glemt oss?
  Svar "Ja" på denne meldingen om du kunne tenke deg å stå på listen vår.
  Svar "Nei" om du ikke har lyst.
  Svar "Tja" om du vil vi skal fortelle deg mer.`
  if (file) {
    console.log(`Got job: ${file}`)
    const data = await csv().fromFile(`data/${file}`)
    console.log(`Got data: ${data.length} entries`)
    let jobs = data
      .filter(line => ['r3'].includes(line.SMS.toLowerCase()))
      .filter(line => line.Status.toLowerCase() === 'ikke svart')
      .filter(line => line.Mobil !== '')
      .map(line => Object.assign({}, line, { message: message }))
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
