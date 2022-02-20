export interface Person {
    fistName: string;
    lastName: string;
    email: string;
}

export interface Pet {
    name: string;
    dob: Date;
    type: PetType;
}

export enum PetType {
    Cat,
    Dog,
    Lizard,
    Other,
}

export enum RelationType {
    Owner,
    Claim,
}
