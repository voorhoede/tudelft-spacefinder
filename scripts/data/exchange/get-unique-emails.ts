import type { CsvSpaceData } from "./../../../src/types/Space";

export default function getUniqueEmails(
  spaces: Pick<CsvSpaceData, "exchangeBuildingId" | "exchangeRoomId">[]
) {
  if (!spaces || !Array.isArray(spaces)) return [];
  const uniqueEmailSet = {} as Record<string, boolean>;
  for (const space of spaces) {
    if (space.exchangeBuildingId)
      uniqueEmailSet[space.exchangeBuildingId] = true;
    if (space.exchangeRoomId) uniqueEmailSet[space.exchangeRoomId] = true;
  }
  const uniqueEmails = Object.keys(uniqueEmailSet);
  uniqueEmails.sort();
  return uniqueEmails;
}
