import { DefaultCreepSettings } from "./../constants/creepSettings";
import { Roles } from "./../constants/roles";
import { CreepManager } from "./../managers/CreepManager";

export class HarversterRole {

    private creepManager: CreepManager = new CreepManager();

    public harvestEnergy = (harvestingCreeps: Creep[]) => {
        // tslint:disable-next-line:forin
        for (const creepIndex in harvestingCreeps) {
            const creep = harvestingCreeps[creepIndex];
            if (creep.carry.energy < creep.carryCapacity) {
                const sources: Source[] = creep.pos.findClosestByPath(FIND_SOURCES) as Source[];
                // const sources: Source[] = creep.room.find(FIND_SOURCES) as Source[];
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
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

    public createHarvestersIfNeeded = (harvestingCreeps: Creep[]) => {

        const harvesterBaseName = `${Roles.CREEP_HARVERSTER_ROLE}_Harry_`;
        this.creepManager.createCreeps(harvestingCreeps,
            DefaultCreepSettings.harverstersTargetCount,
            harvesterBaseName);
    }
}
