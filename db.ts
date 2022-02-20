// deno-lint-ignore-file no-empty
// An interesting problem:

/**
 * The object representation of a node in the store - not to be used directly.
 *
 * _Note: Edges should technically be a set, however, JS cannot deeply compare
 * objects so set.has() will not work; hense it is more intuative and performant to use as an array
 * when querying._
 */
interface Node<T, R> {
    edges: Array<Relation<R>>;
    props: T;
}

interface Relation<R> {
    id: number;
    type?: R;
}

/**
 * A graph-like database of nodes and edges.
 *
 * _Note: Nodes are stored in a flat map of IDs to
 * improve performance as JS has no concept of references._
 */
export class GraphDB<T, R> {
    private store = new Map<number, Node<T, R>>();

    /**
     * Insert a new node into the database.
     * @param props: The properties of the new node
     * @returns The ID of the new node
     */
    insert(props: T): number {
        const id = this.store.size + 1; // Autoincrementing ID

        this.store.set(id, {
            edges: [],
            props,
        });
        return id;
    }

    /**
     * Insert a new edge between two nodes.
     * @param from: The ID of the node to insert the edge from
     * @param to: The ID of the node to insert the edge to
     * @param type: The type of relationship between the two nodes
     * @returns True if the edge was inserted
     */
    addRelation(from: number, to: number, relation?: R): boolean {
        const head = this.store.get(from);
        const target = this.store.get(to);

        if (head && target) {
            head.edges.push({
                id: to,
                type: relation,
            });
            this.store.set(from, head);
            return true;
        }

        return false;
    }

    /**
     * Creates a new node and connects it to the given node.
     * @param from: The ID of the node to connect from
     * @param props: The properties of the new node
     * @param relation: The type of relationship between the two nodes
     * @returns The ID of the new node
     */
    insertOnRelation(from: number, props: T, relation?: R): number | undefined {
        const head = this.store.get(from);
        if (!head) return;

        const id = this.insert(props);
        head.edges.push({
            id,
            type: relation,
        });
        this.store.set(from, head);

        return id;
    }

    /**
     * Get the properties of a node from the database.
     * @param id: The ID of the node to get
     * @returns The properties of the node if it exists
     */
    getProps(id: number): T | undefined {
        return this.store.get(id)?.props;
    }

    /**
     * Get the edges of a node from the database.
     * @param id: The ID of the node to get
     * @returns The edges of the node if it exists
     */
    getEdges(id: number): Array<Relation<R>> | undefined {
        const node = this.store.get(id);
        if (!node) return;

        node.edges = node.edges.filter((e) => this.store.has(e.id));
        this.store.set(id, node);

        return node.edges;
    }

    /**
     * Removes a node from the database.
     *
     * @param id: The ID of the node to delete
     * @returns True if the node was found and deleted
     */
    remove(id: number): boolean {
        return this.store.delete(id);
    }

    /**
     * Modify a node in the database.
     * @param id: The ID of the node to modify
     * @param fn: Function to modify the node
     * @returns True if the node was found and modified
     */
    modify(id: number, fn: (node: Node<T, R>) => void): boolean {
        const node = this.store.get(id);
        if (!node) return false;

        try {
            fn(node);
            this.store.set(id, node);
        } catch (_) {
            return false;
        }

        return true;
    }

    /**
     * Query the database for nodes.
     * @id:
     * @param fn: Function to filter nodes
     * @returns An array of nodes that match the query
     * @example
     * const db = new GraphDB<string, string>();
     * const bob = db.insert("Bob");
     * db.insertOnRelation(bob, "Barry", "Friend");
     *
     * // Returns [{props: "Barry", edges: []}]
     * console.log(
     *   db.query(bob, (relationship) => {
     *     return relationship.type === "Friend";
     *   })
     * );
     *
     */
    query(
        id: number,
        fn: (relation: Relation<R>, node: Node<T, R>) => boolean
    ): Array<Node<T, R>> | undefined {
        const node = this.store.get(id);
        if (!node) return;

        const result = new Array<Node<T, R>>();
        const prunes = new Set<number>();

        for (const relation of node.edges) {
            const node = this.store.get(relation.id);
            if (node) {
                try {
                    if (fn(relation, node)) result.push(node);
                } catch (_) {}
            } else {
                prunes.add(relation.id);
            }
        }

        // Remove edges that lead to non-existent nodes
        if (prunes.size > 0) {
            node.edges = node.edges.filter((e) => !prunes.has(e.id));
            this.store.set(id, node);
        }

        return result;
    }
}
