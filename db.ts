/**
 * The object representation of a node in the store - not to be used directly.
 *
 * _Note: Edges should technically be a set, however, JS cannot deeply compare
 * objects so set.has() will not work; hense it is more intuative and performant to use as an array
 * when querying._
 */
interface Node<T> {
    edges: Array<number>;
    props: T;
}

interface Edge<R> {
    to: number;
    from: number;
    type?: R;
}

type Direction = "to" | "from";

/**
 * A bi-directional graph database of nodes and edges.
 *
 * _Note: vertecies/edges are stored in a flat map of IDs to
 * improve performance as JS has no concept of references._
 */
export class GraphDB<T, R> {
    private vertecies = new Map<number, Node<T>>();
    private edges = new Map<number, Edge<R>>();

    /**
     * Insert a new node into the database.
     * @param props: The properties of the new node
     * @returns The ID of the new node
     */
    insert(props: T): number {
        const id = this.vertecies.size + 1; // Autoincrementing ID

        this.vertecies.set(id, {
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
        const origin = this.vertecies.get(from);
        const target = this.vertecies.get(to);

        if (origin && target) {
            const edgeID = this.edges.size + 1;
            origin.edges.push(edgeID);
            target.edges.push(edgeID);
            this.vertecies.set(from, origin);
            this.vertecies.set(to, target);
            this.edges.set(edgeID, { from, to, type: relation });
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
        const origin = this.vertecies.get(from);
        if (!origin) return;

        // Autoincrementing IDs
        const edgeID = this.edges.size + 1;
        const to = this.vertecies.size + 1;

        origin.edges.push(edgeID);
        this.vertecies.set(from, origin);
        this.vertecies.set(to, {
            edges: [edgeID],
            props,
        });
        this.edges.set(edgeID, { from, to, type: relation });

        return to;
    }

    /**
     * Get the a node rom the database.
     * @param id: The ID of the node to get
     * @returns The node if it exists
     */
    get(id: number): Node<T> | undefined {
        return this.vertecies.get(id);
    }

    /**
     * Get the an edge from the database.
     * @param id: The ID of the edge to get
     * @returns The edge if it exists
     */
    getEdge(id: number): Edge<R> | undefined {
        return this.edges.get(id);
    }

    /**
     * Get the related vertex on an edge
     * @param vertexID the original node
     * @param edgeID the id of the edge
     * @returns the related vertex
     */
    getRelation(vertexID: number, edgeID: number): Node<T> | undefined {
        const edge = this.edges.get(edgeID);
        if (!edge) return;

        return this.vertecies.get(edge.from === vertexID ? edge.to : edge.from);
    }

    /**
     * Removes a node from the database.
     *
     * @param id: The ID of the node to delete
     * @returns True if the node was found and deleted
     */
    remove(id: number): boolean {
        const node = this.vertecies.get(id);
        if (!node) return false;

        // Remove all edges and references to said edges
        for (const e of node.edges) {
            const edge = this.edges.get(e) as Edge<R>;
            const direction = edge.from === id ? edge.to : edge.from;

            const v = this.vertecies.get(direction) as Node<T>;
            v.edges = v.edges.filter((value) => value !== e);

            this.vertecies.set(direction, v);
            this.edges.delete(e);
        }
        return this.vertecies.delete(id);
    }

    /**
     * Removes an edge (relation) from the database.
     *
     * @param id: The ID of the node to delete
     * @returns True if the node was found and deleted
     */
    removeRelation(id: number): boolean {
        const edge = this.edges.get(id);
        if (!edge) return false;

        this.removeLocalEdge(id, edge.from);
        this.removeLocalEdge(id, edge.to);
        return this.edges.delete(id);
    }

    // Remove reference to an edge from vertex
    private removeLocalEdge(edgeID: number, vertexID: number) {
        const node = this.vertecies.get(vertexID) as Node<T>;
        node.edges = node.edges.filter((e) => e !== edgeID);
        this.vertecies.set(vertexID, node);
    }

    /**
     * Modify a node in the database.
     * @param id: The ID of the node to modify
     * @param fn: Function to modify the node
     * @returns True if the node was found and modified
     */
    modifyProps(id: number, fn: (n: T) => void): boolean {
        const node = this.vertecies.get(id);
        if (!node) return false;

        const props = node.props;
        try {
            fn(props);
        } catch {
            return false;
        }
        node.props = props;
        this.vertecies.set(id, node);

        return true;
    }

    /**
     * Modify the relation type of an edge in the database.
     * @param id: The ID of the edge to modify
     * @param relation: The new relation type
     * @returns True if the edge was found and modified
     */
    modifyRelation(id: number, relation: R): boolean {
        const edge = this.edges.get(id);
        if (!edge) return false;

        edge.type = relation;
        this.edges.set(id, edge);

        return true;
    }

    /**
     * Query the database for nodes.
     * @param id - The ID of the node you wish to query
     * @param fn -  Function to filter nodes
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
     */
    query(
        id: number,
        fn: (edgeNode: Node<T>, relation: R | undefined) => boolean,
        direction?: Direction
    ): Array<Node<T>> | undefined {
        const vertex = this.vertecies.get(id);
        if (!vertex) return;

        const result: Array<Node<T>> = [];

        for (const edgeID of vertex.edges) {
            const edgeNode = this.getRelation(id, edgeID) as Node<T>;
            const relation = this.edges.get(edgeID) as Edge<R>;

            // Check that its in the correct direction or no direction supplied
            if (
                ((direction && relation[direction] === id) || !direction) &&
                fn(edgeNode, relation.type)
            )
                result.push(edgeNode);
        }

        return result;
    }
}
