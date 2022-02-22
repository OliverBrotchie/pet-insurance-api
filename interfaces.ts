export interface Person {
    fistName: string;
    lastName: string;
    email: string;
}

export interface Pet {
    name: string;
    dob: Date;
    type: PetType;
    insurance: InsuranceStatus;
}

export enum PetType {
    Cat,
    Dog,
    Lizard,
    Other,
}

export enum InsuranceStatus {
    FullyCovered,
    AccidentOnly,
    NoCoverage,
}

export interface Claim {
    description: string;
    date: Date;
    cost: number;
    status: ClaimStatus;
}

export enum ClaimStatus {
    Pending,
    Approved,
    Rejected,
}

export enum RelationType {
    Owner,
    Claim,
}
