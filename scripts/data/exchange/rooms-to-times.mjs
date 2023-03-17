export default (exchangeIds, availabilityResponse) => {
  const calendarList =
    availabilityResponse.FreeBusyResponseArray?.FreeBusyResponse ?? [];
  const events = calendarList.map(
    (calendar) =>
      calendar.FreeBusyView?.CalendarEventArray?.CalendarEvent ?? null
  );
  const result = {};
  for (const i = 0; i < exchangeIds.length; i++) {
    const event = events[i];
    if (!event) continue;
    result[exchangeIds[i]] = event;
  }
  return result;
};
