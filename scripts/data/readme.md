# Data
Scripts to retrieve application data from various sources

## Test
To manually test getting data from a source, just invoke the module.

```sh
# Dato CMS
node -e "require('./scripts/data/cms')().then(console.log)"
```

### Use
Set environment variables to enable mock data. This prevents calling out to the 
actual external sources:

```sh
# enable mock data for TU Delft Exchange
USE_MOCK_DATA_EXCHANGE=1
```
