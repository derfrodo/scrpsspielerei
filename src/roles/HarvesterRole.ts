import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { DefaultCreepSettings } from "./../constants/creepSettings";
import { Roles } from "./../constants/roles";

import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IHarvesterRole } from "./Contract/IHarvesterRole";

@injectable()
export class HarversterRole implements IHarvesterRole {

    private creepManager: ICreepManager;

    public constructor( @inject(TYPES.CreepManager) creepManager: ICreepManager) {
        this.creepManager = creepManager;
    }

    public harvestEnergy(harvestingCreeps: Creep[]) {
        // tslint:disable-next-line:forin
        for (const creepIndex in harvestingCreeps) {
            const creep = harvestingCreeps[creepIndex];
            if (creep.carry.energy < creep.carryCapacity) {
                const source: Source = creep.pos.findClosestByPath(FIND_SOURCES) as Source;
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source.pos, HarvesterCreepMoveOptions);
                }
            } else {
                const availableSpawns: Spawn[] =
                    _.filter(creep.room.find(FIND_MY_SPAWNS) as Spawn[], (s) => s.energy < s.energyCapacity) as Spawn[];

                if (availableSpawns.length > 0) {
                    if (creep.transfer(availableSpawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(availableSpawns[0].pos, HarvesterCreepMoveOptions);
                    }
                    return;
                }

                const availableExtensions: Extension[] =
                    _.filter(creep.room.find(FIND_STRUCTURES) as Structure[],
                        (s) => s.structureType === STRUCTURE_EXTENSION &&
                            (s as StructureExtension).energy <
                            (s as StructureExtension).energyCapacity) as StructureExtension[];

                if (availableExtensions.length > 0) {
                    if (creep.transfer(availableExtensions[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(availableExtensions[0].pos, HarvesterCreepMoveOptions);
                    }
                    return;
                }

                const closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS) as Spawn;
                creep.moveTo(closestSpawn.pos);
            }
        }
    }
}

const HarvesterCreepMoveOptions: MoveToOpts = {
    visualizePathStyle: {
        fill: "transparent",
        lineStyle: "dashed",
        opacity: .1,
        stroke: "#fff",
        strokeWidth: .15,
    },
};
