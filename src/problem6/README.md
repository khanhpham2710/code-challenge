# Problem 6: Architecture

## Model
class User {
    id: UUID (primary key);
    username: string;
    password: string;
    score: number;
    lastUpdated: timestamp;
    created: timestamp;
}

## Link: https://app.diagrams.net/?src=about#G1rzPhUpCBspFyWWiKBmAV0yz1yX1-L6Og#%7B%22pageId%22%3A%22zB7427RQOkVwFC4dwnVW%22%7D

## Extra:
- Add cache (maybe redis) for faster query of the scoreboard. Update scoreboard cache after each score change
- Add rate limiting to prevent abuse
- When expand to a microservice architecture, divide into auth service, user service and score service. Auth will handle authentication with jwt, user service will store the user info and score service will handle score management (update scoreboard, cache).
- When there is a huge number of users with scores, we can change the the point service in to CQRS. Old users will have higher scores than new users so the scoreboard is unlikely to change so change to CQRS with read/query or write/command will improve the performance