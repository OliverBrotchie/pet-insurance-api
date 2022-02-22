import * as Drash from "https://deno.land/x/drash@v2.5.3/mod.ts";
import { Users, Pets, Claims } from "./resources.ts";
import { Authentication } from "./services.ts";

const PORT = "8080";

const server = new Drash.Server({
    hostname: "localhost",
    port: parseInt(PORT),
    protocol: "http",
    resources: [Users, Pets, Claims],
    services: [new Authentication()],
});

server.run();
console.log(`Server running at ${server.address} 🚀`);
