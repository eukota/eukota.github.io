<!-- DRAFT: first pass written by Claude from the project notes. Rewrite in your own voice before publishing. -->
# AI Projects

Things I've built and am building, with AI as part of how I work.

## Kinetic Time Machine

A real-time photo tracker and live location map for the Kinetic Grand Championship, a three-day, human-powered sculpture race through Humboldt County, California. The route runs from Arcata to Eureka, Crab Park and Ferndale. I've lived in Arcata and been involved with the race since 2009, and I built this for the 2026 race.

Spectators and crews submit geotagged photos, which show up on an interactive map. Participants can also choose to share their live location during the race. Sharing starts with a request that an admin approves, and the map updates every 30 seconds. It runs as a React front end with a FastAPI back end.

[Source on GitHub](https://github.com/eukota/kinetic-time-machine)

## Kinetic Photo Booth

A photo booth for Kinetic events, built for the Haunted Lab of Horrors haunted house in October 2026. A camera in the booth takes the photo, uploads it to cloud storage, and puts it in an event gallery. Each photo gets a QR code so a guest can scan it and download their own picture on their phone.

Each event gets its own theme across the booth, the gallery and the photo page. The haunted one has dripping slime, rotten-plum curtains, a flickering green marquee and a Creepster font. A kiosk mode gives each group of guests a session, so they only see their own photos instead of everyone's. The whole thing runs serverless on AWS, and it can run on a laptop for testing. Paid downloads are planned as a separate project.

The code is in a private repository for now.
