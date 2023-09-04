import { writeFile } from 'node:fs/promises';
import getAvailability from '../../scripts/data/exchange/room-availability';
import exchangeIds from '../../mock/exchange/emails.json';

// Force fetching fresh data from exchange
process.env.USE_MOCK_DATA_CMS = '0'

getAvailability(exchangeIds)
  .then((result) => (
    writeFile('./mock/exchange/availability.json', JSON.stringify(result, null, 2))
  ));
