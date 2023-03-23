// @ts-ignore

import { parseReponse } from "./soap-client";

describe("Parsing Exchange SOAP response", () => {
  it("works", () => {
    const availability = parseReponse(`
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <GetUserAvailabilityResponse xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <FreeBusyResponseArray xmlns="https://schemas.microsoft.com/exchange/services/2006/messages">
            <FreeBusyResponse>
              <ResponseMessage ResponseClass="Success">
                <Path select="/m:GetUserAvailabilityRequest/MailboxDataArray[0]" />
              </ResponseMessage>
              <FreeBusyView>
                <FreeBusyViewType xmlns="https://schemas.microsoft.com/exchange/services/2006/types">Detailed</FreeBusyViewType>
                <CalendarEventArray xmlns="https://schemas.microsoft.com/exchange/services/2006/types">
                  <CalendarEvent>
                    <StartTime>2006-02-28T19:00:00-08:00</StartTime>
                    <EndTime>2006-02-28T23:30:00-08:00</EndTime>
                    <BusyType>OOF</BusyType>
                    <IsPrivate>false</IsPrivate>
                    <CalendarEventDetails>
                      <ID>00000</ID>
                      <Subject>Exercise</Subject>
                      <Location>the gym</Location>
                      <IsMeeting>false</IsMeeting>
                      <IsRecurring>false</IsRecurring>
                      <IsException>false</IsException>
                      <IsReminderSet>true</IsReminderSet>
                    </CalendarEventDetails>
                  </CalendarEvent>
                </CalendarEventArray>
                <WorkingHours xmlns="https://schemas.microsoft.com/exchange/services/2006/types">
                  <TimeZone>
                    <Bias>480</Bias>
                    <StandardTime>
                      <Bias>0</Bias>
                      <Time>02:00:00</Time>
                      <DayOrder>5</DayOrder>
                      <Month>10</Month>
                      <DayOfWeek>Sunday</DayOfWeek>
                    </StandardTime>
                    <DaylightTime>
                      <Bias>-60</Bias>
                      <Time>02:00:00</Time>
                      <DayOrder>1</DayOrder>
                      <Month>4</Month>
                      <DayOfWeek>Sunday</DayOfWeek>
                    </DaylightTime>
                  </TimeZone>
                  <WorkingPeriodArray>
                    <WorkingPeriod>
                      <DayOfWeek>Monday Tuesday Wednesday Thursday Friday</DayOfWeek>
                      <StartTimeInMinutes>480</StartTimeInMinutes>
                      <EndTimeInMinutes>1020</EndTimeInMinutes>
                    </WorkingPeriod>
                  </WorkingPeriodArray>
                </WorkingHours>
              </FreeBusyView>
            </FreeBusyResponse>
          </FreeBusyResponseArray>
        </GetUserAvailabilityResponse>
      </s:Body>
    </s:Envelope>
    `);
    expect(availability).not.toBeFalsy();
    expect(availability.FreeBusyResponseArray).not.toBeFalsy();
    expect(availability.FreeBusyResponseArray.FreeBusyResponse).not.toBeFalsy();
  });
});
