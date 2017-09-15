import { MyCreeps } from "./MyCreeps";

export interface ICreepManager {
    createCreeps(existingCreeps: Creep[], maximumCreeps: number, creepBaseName: string, creepParts: string[]): void;
    resolveMyCreeps(): MyCreeps;
    getOrCreateCreepArrayByRole(myCreeps: MyCreeps, roleName: string): Creep[];
}
