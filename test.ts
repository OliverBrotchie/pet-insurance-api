import { Person, RelationType } from "./interfaces.ts";
import { GraphDB } from "./db.ts";

const p: Person = {
    fistName: "First",
    lastName: "Last",
    email: "Email",
};

Deno.test("DB - Insert", () => {
    const db = new GraphDB<Person, null>();

    if (!db.getProps(db.insert(p))) throw new Error("Insert failed");
});

Deno.test("DB - Add Relation", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);
    const y = db.insert(p);

    if (!db.addRelation(x, y, RelationType.Claim))
        throw new Error("Add relation failed");

    for (const e of db.getEdges(x) ?? []) {
        if (e.id === y && e.type === RelationType.Claim) return;
    }

    throw new Error("Relation not found on object");
});

Deno.test("DB - Insert On Relation", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);
    const y = db.insertOnRelation(x, p, RelationType.Claim);

    if (!y) throw new Error("Add relation failed");

    for (const e of db.getEdges(x) ?? []) {
        if (e.id === y && e.type === RelationType.Claim) return;
    }

    throw new Error("Relation not found on object");
});

Deno.test("DB - Query Relation", () => {
    const db = new GraphDB<Person, RelationType>();

    const x = db.insert(p);

    for (let i = 0; i < 5; i++) {
        db.insertOnRelation(x, p, RelationType.Claim);
    }

    db.insertOnRelation(x, p, RelationType.Owner);

    const result = db.query(x, (relation) => {
        return relation.type === RelationType.Claim;
    });

    if (result?.length !== 5) throw new Error("Query failed");
});

Deno.test("DB - Insert 1000", () => {
    const db = new GraphDB<Person, null>();

    for (let i = 0; i < 1000; i++) {
        db.insert(p);
    }
});
