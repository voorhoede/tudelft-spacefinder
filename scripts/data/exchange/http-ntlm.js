const httpntlm = require('httpntlm')

const getClient = config => (xml) => {
  return new Promise((resolve, reject) => {
    httpntlm.post({
      ...config,
      headers: {
        'Content-type': 'text/xml'
      },
      body: xml
    }, (err, res) => {
      if (err) {
        return reject(err)
      }
      resolve(res)
    })
  })
}

const doc = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                 xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
                 xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages">
    <soap:Header>
      <t:RequestServerVersion Version ="Exchange2010_SP1"/>
    </soap:Header>
    <soap:Body>
      <m:GetRooms>
        <m:RoomList>
          <t:EmailAddress>TBM-MAS-BA-MeetingRooms@forest.intra</t:EmailAddress>
        </m:RoomList>
      </m:GetRooms>
    </soap:Body>
  </soap:Envelope>`

module.exports = config => () => {
  const client = getClient(config)
  return client(doc)
}
