function getMailboxData(emails: string[]) {
  return emails
    .map(
      (email) =>
        `<t:MailboxData>
      <t:Email>
        <t:Address>${email}</t:Address>
      </t:Email>
    </t:MailboxData>`
    )
    .join("\n");
}

export function soapTemplate({
  emails = [],
  start,
  end,
}: {
  emails: string[];
  start: string;
  end: string;
}) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:tns="http://schemas.microsoft.com/exchange/services/2006/messages"
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
  xmlns:wsi="http://ws-i.org/schemas/conformanceClaim/">
  <soap:Header></soap:Header>
  <soap:Body>
    <GetUserAvailabilityRequest xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">
      <t:TimeZone xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
        <t:Bias>-60</t:Bias>
        <t:StandardTime>
          <t:Bias>0</t:Bias>
          <t:Time>03:00:00</t:Time>
          <t:DayOrder>5</t:DayOrder>
          <t:Month>10</t:Month>
          <t:DayOfWeek>Sunday</t:DayOfWeek>
        </t:StandardTime>
        <t:DaylightTime>
          <t:Bias>-60</t:Bias>
          <t:Time>02:00:00</t:Time>
          <t:DayOrder>5</t:DayOrder>
          <t:Month>3</t:Month>
          <t:DayOfWeek>Sunday</t:DayOfWeek>
        </t:DaylightTime>
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
</soap:Envelope>`;
}
