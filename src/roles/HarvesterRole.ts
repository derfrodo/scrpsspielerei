import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { DefaultCreepSettings } from "./../constants/creepSettings";
import { Roles } from "./../constants/roles";

import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IHarversterRole } from "./Contract/IHarvesterRole";

@injectable()
export class HarversterRole implements IHarversterRole {

    private creepManager: ICreepManager;

    public constructor( @inject(TYPES.CreepManager) creepManager: ICreepManager) {
        this.creepManager = creepManager;
    }

    public harvestEnergy(harvestingCreeps: Creep[]) {
        // tslint:disable-next-line:forin
        for (const creepIndex in harvestingCreeps) {
            const creep = harvestingCreeps[creepIndex];
            if (creep.carry.energy < creep.carryCapacity) {
                const sources: Source = creep.pos.findClosestByPath(FIND_SOURCES) as Source;
                if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources);
                }
            } else {
                const mySpawns: Spawn[] = creep.room.find(FIND_MY_SPAWNS) as Spawn[];
                if (creep.transfer(mySpawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(mySpawns[0], {
                        visualizePathStyle: {
                            fill: "transparent",
                            lineStyle: "dashed",
                            opacity: .1,
                            stroke: "#fff",
                            strokeWidth: .15,
                        },
                    });
                }
            }
        }
    }

    public createHarvestersIfNeeded(harvestingCreeps: Creep[]) {

        const harvesterBaseName = `${Roles.CREEP_HARVERSTER_ROLE}_Harry_`;
        this.creepManager.createCreeps(harvestingCreeps,
            DefaultCreepSettings.harverstersTargetCount,
            harvesterBaseName);
    }
}
