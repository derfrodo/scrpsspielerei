import { CreepMemory } from "../../memory/CreepMemory";
import { MyCreeps } from "./MyCreeps";

export interface ICreepManager {
    resolveMyCreeps(): MyCreeps;
    getOrCreateCreepArrayByRole(myCreeps: MyCreeps, roleName: string): Creep[];

    getCreepsForRoom(room: Room): Creep[];

    /**
     * returns all harvesting creeps from passed creeps array
     */
    getHarvesters(creeps: Creep[]): Creep[];

    /**
     * returns all upgrader creeps from passed creeps array
     */
    getUpgraders(creeps: Creep[]): Creep[];

    /**
     * returns all builder creeps from passed creeps array
     */
    getBuilders(creeps: Creep[]): Creep[];

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
    getCreepCosts(creepParts: string[]): number;

    getNextCreepName(creepBaseName: string): string;

    harvestFromClosestSource(creep: Creep, moveOptions?: MoveToOpts);
}
