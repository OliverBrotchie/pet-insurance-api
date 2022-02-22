import * as Drash from "https://deno.land/x/drash@v2.5.3/mod.ts";
import { Person, Pet, Claim, RelationType } from "./interfaces.ts";
import { db, Node } from "./db.ts";

interface Post<T> {
    relationID: number;
    params: T;
}

interface Patch<T> {
    id: number;
    params: unknown;
}

function deleteNode(request: Drash.Request, response: Drash.Response): void {
    const id = parseInt(request.bodyParam("id") as string);
    if (id) {
        if (db.remove(id)) return response.text("OK", 200);
        return response.text("Not Found", 404);
    }
}

function getRelations(
    id: number,
    type: RelationType
): Array<Person | Pet | Claim> | undefined {
    return db
        .query(id, (_, r) => {
            return r === type;
        })
        ?.map((e) => e.props);
}

export class Pets extends Drash.Resource {
    public paths = ["/pets", "/pets/:id", "/pets/:id/claims"];

    // List a pet or all claims of a pet
    public GET(request: Drash.Request, response: Drash.Response): void {
        const id = parseInt(request.pathParam("id") as string);
        if (!id) return response.text("Bad Request", 400);

        const pet = db.get(id);
        if (!pet) return response.text("Not Found", 404);

        // List all claims of a pet
        if (request.url.includes("claims")) {
            return response.json(
                {
                    claims: getRelations(id, RelationType.Claim),
                },
                200
            );
        }

        return response.json(pet.props, 200);
    }

    // Create a new pet
    public async POST(
        request: Drash.Request,
        response: Drash.Response
    ): Promise<void> {
        if (request.url === "/pets") {
            const params = await request.json();

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
        if (request.url.includes("claims"))
            return response.text("Bad Request", 400);

        return deleteNode(request, response);
    }
}

export class Claims extends Drash.Resource {
    public paths = ["/claim", "/claim/:id"];

    // Get a claim via ID
    public GET(request: Drash.Request, response: Drash.Response): void {
        const id = parseInt(request.pathParam("id") as string);
        if (!id) return response.text("Bad Request", 400);

        const claim = db.get(id);
        if (!claim) return response.text("Not Found", 404);

        return response.json(claim.props, 200);
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
        deleteNode(request, response);
    }
}

export class Users extends Drash.Resource {
    public paths = ["/user/:id/pets", "/user/:id/claims"]; // Excluding user creation

    public GET(request: Drash.Request, response: Drash.Response): void {
        const id = parseInt(request.pathParam("id") as string);
        if (!id) return response.text("Bad Request", 400);

        const pets = getRelations(id, RelationType.Owner);
        if (!pets) return response.text("Not Found", 404);

        if (request.url.includes("/pets")) {
            return response.json({ pets: pets }, 200);
        }

        if (request.url.includes("/claims")) {
            // double join
        }
    }
}
