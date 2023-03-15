# Add Supabase as database

We decided to add Supabase to the project stack as it allows us to store relational data sources and provide real-time updates in the Spacefinder app.

- Alternatives Considered: SQLite, Amazon RDS for PostgreSQL, Firebase.
- Decision Made By: [Jasper](https://github.com/jbmoelker).

## Decision

The upcoming iteration of the Spacefinder will display occupancy indicators based on a stream of access points data. This data needs to be stored and aggregated to data more directly useful in the app. The Spacefinder therefore requires a database. We decided Supabase is most suitable as database for this project because:

- The Spacefinder data is clear relation database, for which Supabase, a PostgreSQL database, is very suitable.
- Supabase supports real-time subscriptions which is an important aspect of the upcoming building and space occupancy indicators.
- Supabase supports local development and easy environment parity with auto-generated migration diffs between environments.
- Supabase is completely open source, just like Spacefinder. This ensures the Spacefinder is not vendor-locked now or in the future.
- Supabase is frequently used by project teams at De Voorhoede, meaning a larger team of developers can help out.
- Supabase has predictable pricing with a flat fee per month, which can be easily be calculated with in Service Level Agreeement.
