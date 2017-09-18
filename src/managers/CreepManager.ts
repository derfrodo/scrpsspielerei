import { inject, injectable } from "inversify";
import { Roles } from "../constants/roles";

import { CreepMemory } from "../memory/CreepMemory";
import { ICreepManager } from "./Contract/ICreepManager";
import { MyCreeps } from "./Contract/MyCreeps";

@injectable()
export class CreepManager implements ICreepManager {

    public getHarvesters(creeps: Creep[]): Creep[] {
        if (creeps) {
            return _.filter(creeps, (creep) => (creep.memory as CreepMemory).role === Roles.CREEP_HARVERSTER_ROLE);
        }
        return [];
    }

    public getUpgraders(creeps: Creep[]): Creep[] {
        if (creeps) {
            return _.filter(creeps, (creep) => (creep.memory as CreepMemory).role === Roles.CREEP_UPGRADER_ROLE);
        }
        return [];
    }

    public getBuilders(creeps: Creep[]): Creep[] {
        if (creeps) {
            return _.filter(creeps, (creep) => (creep.memory as CreepMemory).role === Roles.CREEP_BUILDER_ROLE);
        }
        return [];
    }

    public resolveMyCreeps(): MyCreeps {
        const myCreeps = new MyCreeps();

        // tslint:disable-next-line:forin
        for (const creepName in Game.creeps) {
            const creep = Game.creeps[creepName];
            // tslint:disable-next-line:no-console
            // console.log("I am " + creep.name);
            const parts = creep.name.split("_");
            if (parts && parts.length > 0) {
                const creeps = this.getOrCreateCreepArrayByRole(myCreeps, parts[0]);
                creeps.push(creep);
            }
        }

        return myCreeps;
    }

    public getOrCreateCreepArrayByRole(myCreeps: MyCreeps, roleName: string): Creep[] {
        let creeps: Creep[] = myCreeps.creepsByRoles[roleName];

        if (!creeps) {
            creeps = [];
            myCreeps.creepsByRoles[roleName] = creeps;
        }

        return creeps;
    }

    public getCreepsForRoom(room: Room): Creep[] {
        return _.filter(Game.creeps,
            (creep) =>
                creep.room === room);
    }

    public createCreep(
        creepName: string,
        creepParts: string[],
        memory: Pick<CreepMemory, keyof CreepMemory>,
        spawn: StructureSpawn): number {

        const canCreateCreep = spawn.canCreateCreep(creepParts, creepName);
        if (canCreateCreep === 0) {
            // creep can be created: Let's do it!
            const createResult = spawn.createCreep(creepParts, creepName, memory);
            return (typeof (createResult) === "string") ? 0 : createResult;
        }
        return canCreateCreep;
    }

    public canCreateCreepWithName(creepName: string): boolean {
        // name must be unique
        return _.find(Game.creeps, (creep) => creep.name === creepName) ? false : true;
    }

    public canCreateCreepAtSpawn(spawn: StructureSpawn, creepParts: string[]): boolean {
        return spawn.canCreateCreep(creepParts) === 0;
    }

    public getCreepCosts(creepParts: string[]): number {
        return creepParts.reduce(
            (previousResult, currentValue, currentIndex, partsArray) =>
                previousResult += BODYPART_COST[currentValue],
            0);
    }

    public getNextCreepName(creepBaseName: string): string {
        let nameIndex = 0;
        let creepName: string;
        do {
            nameIndex++;
            creepName = creepBaseName + nameIndex;
        } while (!this.canCreateCreepWithName(creepName));
        return creepName;
    }

    public harvestFromClosestSource(creep: Creep, moveOptions?: MoveToOpts) {
        const source: Source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE) as Source;
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source.pos, moveOptions);
        }
    }
}
