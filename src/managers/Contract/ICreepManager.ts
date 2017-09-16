import { MyCreeps } from "./MyCreeps";

export interface ICreepManager {
    resolveMyCreeps(): MyCreeps;
    getOrCreateCreepArrayByRole(myCreeps: MyCreeps, roleName: string): Creep[];

    getCreepsForRoom(room: Room): Creep[];

    getHarvesters(creeps: Creep[]): Creep[];
    getUpgrader(creeps: Creep[]): Creep[];

    canCreateCreepWithName(creepName: string): boolean;
    canCreateCreepAtSpawn(spawn: StructureSpawn, creepParts: string[]): boolean;
    createCreep(
        creepName: string,
        creepParts: string[],
        memory: Pick<CreepMemory, keyof CreepMemory>,
        spawn: StructureSpawn): number;

    /**
     * returns the cost of a creep with corresponding creep parts.
     */
    getCosts(creepParts: string[]): number;
}
