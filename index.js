const {crawl} = require('./crawl')
const services = require('./services')

async function crawlAll(services) {
  for (let i = 0; i < services.length; i++) {
    const {name, AEP, 'OSDI-API-Token': token} = services[i]
    services[i] = {
      name,
      modules: await crawl(AEP, token)
    }
  }
  console.log(JSON.stringify(services, null, 2))
}

crawlAll(services)
