## Auth APIs

- POST /signup
- POST /login
- POST /logout

## Profiles API

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connection APIs

- POST /request/send/interested/:userId
- POST /request/send/pass/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## User APIs

- GET /user/connections
- GET /user/requests/interested
- GET /user/feed
