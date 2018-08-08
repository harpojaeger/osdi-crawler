require('dotenv').config()
const axios = require('axios')
const {OSDI_API_Token, OSDI_API_AEP} = process.env

async function crawl(aep, token) {
  const client = axios.create({
    headers: {'OSDI-API-token': token}
  })
  const visit = async path => {
    try {
      const {data} = await client.get(path)
      if (data) {
        const {_links} = data
        if (_links) {
          Object.entries(_links).forEach(([k, v]) => {
            if (map[k]) {
            } else if (!['data', 'self', 'curies', 'next'].includes(k)) {
              map[k] = v
              visit(v.href)
            }
          })
        }
      }
    }
    catch(e) {
      const err = e.response ? `${e.response.status} ${e.response.statusText}` : 'something went very seriously wrong'
      console.error(`${err} at ${path}`)
    }
  }
  const map = {}
  await visit(aep)
  return map
}

module.exports = {
  crawl
}
