# Switch from Spaces to Rooms

We decided to organising locations in the Spacefinder by room instead of by space as this matches the occupancy data and Exchange service data format.

- Date: 2023-03-21
- Alternatives Considered: continue using spaces and use combined occupancy rate for spaces in the same room.
- Decision Made By: [Jasper](https://github.com/jbmoelker), [Misha](https://github.com/kyrel).

## Decision

Buildings on the TU Delft Campus have physical rooms. Each room can contain one or more spaces either phyisical or administratie only. The 2020 version of the Spacefinder usees buildings and spaces to organise locations. Markers on the map represented spaces, the list of locations listed spaces and each space had its own detail page with its own URL (example: `/en/buildings/34-3me/spaces/ssp00001--gang/`).

The new version of the Spacefinder aims to show occupancy per location, based on the number of devices connected to wifi access points, in real-time. While a building id can be extracted from the wifi access points data, there is no space id (`ssp00001`) available. The wifi access points data does contain room ids. So in order to show occupancy in a sub building level we decided to change from spaces to rooms. This also matches with email addresses used as identifiers for the TU Delft Exchange service to query the opening hours.

We implemented the change from spaces to rooms as follows:

- The application can now organise locations either by rooms or spaces using an environment variable: `SPACES_MODE=rooms|spaces`.
- Data from `studieplekken.csv` is converted to `buildings.json`, `spaces.json` and `rooms.json`.
- Data from spaces with the same room id are combined. Geo coordinates are averaged, services are accumulated.
- Room detail pages reuse the spaces route with a new slug: `/en/buildings/34-3me/spaces/C-1-801/`.
- Occupancy is now calculated per building and per room.
- The list of locations now lists rooms instead of spaces with occupancy indicator based on room occupancy.
- The campus map now has a marker for each room instead of spaces and the marker color represents the room occupancy.
- The Exchange service is currently unavailable. When it's available again, opening hours must be matched per room instead of space.
