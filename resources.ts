import * as Drash from "https://deno.land/x/drash@v2.5.3/mod.ts";
import { Person, Pet, Claim, RelationType } from "./interfaces.ts";
import { GraphDB } from "./db.ts";

const db = new GraphDB<Person | Pet | Claim, RelationType>();

export class Pets extends Drash.Resource {
    public paths = ["/pets", "/pets/:id", "/pets/:id/claims"];

    // List a pet or all claims of a pet
    public GET(request: Drash.Request, response: Drash.Response): void {
        if (request.pathParam("id")) {
            const id = parseInt(request.pathParam("id") as string);
            const pet = db.get(id);

            if (!pet) return response.text("Not Found", 404);

            // List all claims of a pet
            if (request.url.includes("claims")) {
                db.query(id, (_, r) => {
                    return r === RelationType.Claim;
                })?.map((e) => e.props);
            }

            return response.json(pet.props, 200);
        }

        return response.text("Bad Request", 400);
    }

    // Create a new pet
    public POST(request: Drash.Request, response: Drash.Response): void {
        if (request.url === "/pets") {
            // If correct property structure
            // create new Pet on relation to UserID
            // retun OK
        }

        return response.text("Bad Request", 400);
    }

    // Modify pet params
    public PATCH(request: Drash.Request, response: Drash.Response): void {
        // If given id exists,
        // modify the node with supplied params
        return response.text("Im a teapot", 418);
    }

    // Remove a Pet
    public DELETE(request: Drash.Request, response: Drash.Response): void {
        return response.text("Im a teapot", 418); // Stub
    }
}

export class Claims extends Drash.Resource {
    public paths = ["/claim", "/claim/:id"];

    // Get a claim via ID
    public GET(request: Drash.Request, response: Drash.Response): void {
        return response.text("Im a teapot", 418); // Stub
    }

    // Create a new claim given a petID
    public POST(request: Drash.Request, response: Drash.Response): void {
        return response.text("Im a teapot", 418); // Stub
    }

    // Modify the status/params of a claim
    public PATCH(request: Drash.Request, response: Drash.Response): void {
        return response.text("Im a teapot", 418); // Stub
    }

    // Delete a claim
    public DELETE(request: Drash.Request, response: Drash.Response): void {
        return response.text("Im a teapot", 418); // Stub
    }
}

export class Users extends Drash.Resource {
    public paths = ["/user/:id/pets", "/user/:id/claims"]; // Excluding user creation

    public GET(request: Drash.Request, response: Drash.Response): void {
        if (request.url.includes("/pets")) {
            // list all pets of a user
            // See Pets::GET
        }

        if (request.url.includes("/claims")) {
            // list all claims from every pet a user has
            // (double join query)
        }

        return response.text("Im a teapot", 418);
    }
}
