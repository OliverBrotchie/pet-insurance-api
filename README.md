# Pet Insturance API
A coding challenge to develop a simple TS-based API that manages pet insurance.

## Specification

The exercise is to build the endpoints to allow a client to:
- Manage pets
- Manage claims
- List all the pets of said client
- List all claims of said client
- For a given pet, get the list of all the claims

## Implementation

This API will be built using Deno as a runtime and Drash as a framework. 
Ideally, an in-memory caching solution would be used over the top of a traditional SQL database in a read/write-through model, however, I have decided to challenge myself to also create a custom in-memory graph database. 

This provides a few benefits:
- It allows for simple deployment to both Github Actions and local development environments (without the need for containerization).
- It gives me a more complex challenge than creating a simple API.
- It gives me a better way to display technical ability.

## Notes

- `app.ts` is the entry point to the service.
- `services.ts` would contain middleware to validate session tokens.
- `resources.ts` describes the routes and methods with Drash resources.
- `db.ts` a custom graph-like database.
- `test.ts` tests for database (would contain API tests aswell).
- `interfaces.ts` describes the structure of the data.

## Run

**Install Deno:**

```sh
curl -fsSL https://deno.land/install.sh | sh
```

**Run Server:**

```sh
deno run --allow-net app.ts
```

## Tests

Either run the tests locally or verify the results in [Github Actions](https://github.com/OliverBrotchie/pet-insurance-api/actions)!

### Run Tests Locally

**Run tests:**

```sh
deno test
```