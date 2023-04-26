# Switch occupancy from spaces to buildings: icons only

We decided to show occupancy per building instead of per space. This because Themara don't trust the occupancy from the spaces enough to display them. Currently the map markers contains occupancy as in icon type. We decided to replace the occupancy-based map marker icons with a neutral map marker icon in the Spacefinder application, as we now organize locations by building instead of space.

- Date: 2023-04-25
- Alternatives Considered: maintain occupancy-based icons and implement a separate logic to handle building-based occupancy.
- Decision Made By: [Zowie](https://github.com/zowievangeest), [Bas](https://github.com/GoGoGadgetMusic)

## Decision
As the new version of Spacefinder organizes locations by building rather than by space, it became necessary to update the map marker icons to reflect this change. The original occupancy-based icons were:

- map-marker-busy.svg
- map-marker-crowded.svg
- map-marker-quiet.svg
- map-marker-unknown.svg

These icons were replaced with the neutral icon svg code. This allows us to maintain the existing application logic while updating the visual representation of locations on the map. The original icons have been moved to public/icons/markers and can be re-integrated later if we obtain accurate occupancy data for individual spaces.

To implement this change, we followed these steps:

1. Created a new neutral map marker.
2. Replaced the original occupancy-based icons with the neutral icon svg code in svg.
3. Moved the original icons to the `public/icons/markers` directory for future use.
4. Updated any related documentation and testing scenarios to reflect the change in icon usage.

