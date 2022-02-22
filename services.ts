import * as Drash from "https://deno.land/x/drash@v2.5.3/mod.ts";

export class Authentication extends Drash.Service {
    public runBeforeResource(_request: Drash.Request): void {
        // Authenticate a request token
        // Runs before any resource
    }
}
