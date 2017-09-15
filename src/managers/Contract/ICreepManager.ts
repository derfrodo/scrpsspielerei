import { MyCreeps } from "./MyCreeps";

export interface ICreepManager {
    createCreeps(existingCreeps: Creep[], maximumCreeps: number, creepBaseName: string): void;
    resolveMyCreeps(): MyCreeps;
}
