export default function getUniqueEmails(spaces) {
  if (!spaces || !Array.isArray(spaces)) return [];
  const uniqueEmailSet = {};
  for (const space of spaces) {
    if (space.exchangeBuildingId)
      uniqueEmailSet[space.exchangeBuildingId] = true;
    if (space.exchangeRoomId) uniqueEmailSet[space.exchangeRoomId] = true;
  }
  const uniqueEmails = Object.keys(uniqueEmailSet);
  uniqueEmails.sort();
  return uniqueEmails;
}
