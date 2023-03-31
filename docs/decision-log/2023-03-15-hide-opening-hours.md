# Hide opening hours

The Spacefinder currently can't connect to the TU Delft Exchange service resulting in outdated incorrect opening hours in the app. We've decided to hide the opening hours until this is corrected.

- Date: 2023-03-15
- Alternatives Considered: restore Exchange connection, remove opening hours completely
- Decision Made By: [Jasper](https://github.com/jbmoelker), [Misha](https://github.com/kyrel).

## Decision

The reason the Spacefinder can no longer connect to the TU Delft Exchange is that the credentials are no longer accepted. This appareantly has been the case for a while. A ticket is created at TU Delft Education and Student Affairs (ESA) to restore this connection. As there is no timeline for resolution available we've decided to hide the opening hours. As displaying open hours is still a desired feature and we'd like to reactivate it in the future, we decided not to remove the opening hours completely. 

The opening hours are therefore conditionally hidden using an environment variable `IS_OPENING_HOURS_ENABLED=0`. This does allow testing the feature on deploy previews.

The Spacefinder app was originally developed as a static generated website. Opening hours were therefore also added to the locations during build-time. Since, the Spacefinder does not receive updates on changes in opening hours, a cron job is used to trigger a nightly build (`.github/workflows/scheduled-build.yml`). Since this is not desired at the time, the nightly build has been removed. When the opening hours become available again the team can decide to readd the nightly build or use the database that is now in use for occupancy.
