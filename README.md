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

A GraphQL service would fit this application best, however, this is not possible as it is supposed to be a restful API.
Therefore, this API will be built using Deno as a runtime and Drash as a framework. 

Ideally, an in-memory caching solution would be used over the top of a traditional SQL database in a read/write-through model, but I have decided to challenge myself to create a custom graph database. 

This provides a few benefits:
- It allows for simple deployment to both Github Actions and local development environments.
- It gives me a more complex challenge than creating a simple API.
- It gives me a better way to display technical ability.

## Tests

Either run the tests locally or verify the results in [Github Actions](https://github.com/OliverBrotchie/ts-assert/actions)!

### Run Tests Locally

**Install Deno:**

```sh
curl -fsSL https://deno.land/install.sh | sh
```

**Run tests:**

```sh
git clone https://github.com/OliverBrotchie/ts-assert.git && cd ts-assert && deno test
```