const getMailboxData = (emails) => {
  return emails.map(email =>
    `<t:MailboxData>
      <t:Email>
        <t:Address>${email}</t:Address>
      </t:Email>
    </t:MailboxData>`
  ).join('\n')
}

module.exports = ({ emails = [], start, end }) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:tns="http://schemas.microsoft.com/exchange/services/2006/messages"
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
  xmlns:wsi="http://ws-i.org/schemas/conformanceClaim/">
  <soap:Header></soap:Header>
  <soap:Body>
    <GetUserAvailabilityRequest xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">
      <t:TimeZone xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
        <t:Id>Central Europe Standard Time</t:Id>
      </t:TimeZone>
      <MailboxDataArray xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
        ${getMailboxData(emails)}
      </MailboxDataArray>
      <t:FreeBusyViewOptions xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
        <t:TimeWindow>
          <t:StartTime>${start}</t:StartTime>
          <t:EndTime>${end}</t:EndTime>
        </t:TimeWindow>
      </t:FreeBusyViewOptions>
    </GetUserAvailabilityRequest>
  </soap:Body>
</soap:Envelope>`
