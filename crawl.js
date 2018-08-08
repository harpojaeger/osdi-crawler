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
              console.log('already visited', k)
            } else if (!['data', 'self', 'curies'].includes(k)) {
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
  var res = await visit(aep)
  console.log(map)

}

crawl(OSDI_API_AEP, OSDI_API_Token)

module.exports = {
  crawl
}
