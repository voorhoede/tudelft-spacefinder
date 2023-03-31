# Location data as CSV

The TU Delft provides a list of locations to display in the Spacefinder. Since a direct API connection isn't possible the list is exchanged via email as a CSV file.

- Date: 2019-07-11 (backdated entry added later as we deemed the decision significant)
- Alternatives Considered: TopDesk API
- Decision Made By: [Jasper](https://github.com/jbmoelker), Thadee.

## Decision

The TU Delft provides a list of locations as a CSV file (`data/studieplekken.csv`). The file is generated from a system of TU Delft Education and Student Affairs (ESA) and emailed to the Spacefinder team. Since new CSV files are rarely received, the location data is stored in the codebase and compiled into useable files (`src/data/buildings.json` and `spaces.json`) during build-time. The TU Delft plans to make the location data available through a TopDesk API in the future, but there is no timeline available.
