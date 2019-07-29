# Data
Scripts to retrieve application data from various sources

## Test
To manually test getting data from a source, just invoke the module.

```sh
# Dato CMS
node -e "require('./scripts/data/cms')().then(console.log)"
```

## Mock data
Mock data for cms and exchange is in `./mock`

### Use
Set environment variables to enable mock data. This prevents calling out to the 
actual external sources:

```sh
# enable mock data for Dato CMS
USE_MOCK_DATA_CMS=1
# enable mock data for TU Delft Exchange
USE_MOCK_DATA_EXCHANGE=1
```

### Update
To update mock data for TU Delft Exchange:

```sh
node -e "require('./scripts/data/exchange/room-availability')(require('./mock/exchange/emails.json')).then(result => require('fs').writeFileSync('./mock/exchange/availability.json', JSON.stringify(result, null, 2)))"
```
