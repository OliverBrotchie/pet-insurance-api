// deno-lint-ignore-file no-explicit-any

class GraphDB<T, R> {
    store = new Map<string, Node<T, R>>();

    add(props: T): string {
        return "";
    }
}

interface Node<T, R> {
    edges: Set<Relation<R>>;
    props: T;
}

interface Relation<R> {
    id: string;
    type: R;
}

interface Person {
    fistName: string;
    lastName: string;
    email: string;
}

interface Pet {
    name: string;
    dob: Date;
    type: PetType;
}

enum PetType {
    Cat,
    Dog,
    Lizard,
    Other,
}

enum RelationType {
    Owner,
    Claim,
}

Deno.test("Map 1000 Inserts", () => {
    const db = new GraphDB<Person | Pet, RelationType>();
});
