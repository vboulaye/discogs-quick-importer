# discogs-quick-importer

discogs-quick-importer is a basic webapp to simplify uploading a collection to Discogs.

It is designed to be used in conjunction with the Discogs API, you need a user token from https://www.discogs.com/settings/developers

The token and associated user id should be set in a .env file in the root directory of the project.

# installation

After cloning the repository:
- Initialize the `.env` from `.env.example` with  `cp .env.example .env`
- edit the variables PRIVATE_DISCOGS_USER_LOGIN and PRIVATE_DISCOGS_USER_TOKEN in the .env file with your own credentials 
- install the required packages with: `npm install`
- you can now start the dev server with `npm run dev`
- it starts a server locally on http://localhost:5173/
 