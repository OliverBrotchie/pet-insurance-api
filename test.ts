import { Person, RelationType } from "./interfaces.ts";
import { GraphDB } from "./db.ts";

const p: Person = {
    fistName: "First",
    lastName: "Last",
    email: "Email",
};

Deno.test("DB - Insert", () => {
    const db = new GraphDB<Person, null>();

    if (!db.get(db.insert(p))) throw new Error("Insert failed");
});

Deno.test("DB - Add Relation", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);
    const y = db.insert(p);

    if (!db.addRelation(x, y, RelationType.Claim))
        throw new Error("Add relation failed");

    for (const e of db.get(x)?.edges ?? []) {
        const edge = db.getEdge(e);
        if (edge?.to === y && edge.type === RelationType.Claim) return;
    }

    throw new Error("Relation not found on object");
});

Deno.test("DB - Insert On Relation", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);
    const y = db.insertOnRelation(x, p, RelationType.Claim);

    if (!y) throw new Error("Add relation failed");

    for (const e of db.get(x)?.edges ?? []) {
        const edge = db.getEdge(e);
        if (edge?.to === y && edge.type === RelationType.Claim) return;
    }

    throw new Error("Relation not found on object");
});

Deno.test("DB - Remove", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);
    const y = db.insertOnRelation(x, p, RelationType.Claim);

    if (!y) throw new Error("Add relation failed");
    db.remove(y);

    if (db.get(x)?.edges.length === 0) return;

    throw new Error("Relation found on object");
});

Deno.test("DB - Modify Props", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);
    const y = db.insertOnRelation(x, p, RelationType.Owner) as number;

    db.modifyProps(x, (props) => {
        props.email = "New Email";
    });

    if (!(db.get(x)?.props?.email === "New Email"))
        throw new Error("Modification failed");
});

Deno.test("DB - Modify Relation", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);
    const y = db.insertOnRelation(x, p, RelationType.Owner) as number;

    db.modifyRelation(db.get(x)?.edges[0] ?? 0, RelationType.Claim);

    if (!(db.get(x)?.props?.email === "New Email"))
        throw new Error("Modification failed");
});

Deno.test("DB - Quey", () => {
    const db = new GraphDB<Person, RelationType>();
    const x = db.insert(p);

    db.insertOnRelation(x, p, RelationType.Claim) as number;
    for (let i = 0; i < 10; i++)
        db.insertOnRelation(x, p, RelationType.Owner) as number;

    if (
        db.query(x, (_, r) => {
            return r === RelationType.Owner;
        })?.length === 10
    )
        return;

    throw new Error("Not correct query length");
});

Deno.test("DB - Insert 1000", () => {
    const db = new GraphDB<Person, null>();

    for (let i = 0; i < 1000; i++) {
        db.insert(p);
    }
});
