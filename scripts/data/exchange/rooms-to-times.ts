export default (exchangeIds: string[], availabilityResponse: any) => {
  const calendarList: any[] =
    availabilityResponse.FreeBusyResponseArray?.FreeBusyResponse ?? [];
  const events = calendarList.map(
    (calendar) =>
      calendar.FreeBusyView?.CalendarEventArray?.CalendarEvent ?? null
  );
  const result: Record<string, any> = {};
  for (let i = 0; i < exchangeIds.length; i++) {
    const event = events[i];
    if (!event) continue;
    result[exchangeIds[i]] = event;
  }
  return result;
};
