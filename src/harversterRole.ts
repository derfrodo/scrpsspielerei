import { DefaultCreepSettings } from "./constants/creepSettings";
import { Roles } from "./constants/roles";

export class HarversterRole {

    public harvestEnergy = (harvestingCreeps: Creep[]) => {
        // tslint:disable-next-line:forin
        for (const creepIndex in harvestingCreeps) {
            const creep = harvestingCreeps[creepIndex];
            if (creep.carry.energy < creep.carryCapacity) {
                const sources: Source[] = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else {
                const mySpawns: Spawn[] = creep.room.find(FIND_MY_SPAWNS);
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

        if (harvestingCreeps.length < DefaultCreepSettings.harverstersTargetCount) {
            const harvesterBaseName = `${Roles.CREEP_HARVERSTER_ROLE}_Harry_`;
            let i = 0;

            let nextCreepName = harvesterBaseName + i;
            while (Game.creeps[harvesterBaseName + i]) {
                i++;
                nextCreepName = harvesterBaseName + i;
            }

            // tslint:disable-next-line:forin
            for (const spawnName in Game.spawns) {

                const spawn = Game.spawns[spawnName];

                if (spawn.canCreateCreep([CARRY, WORK, MOVE], nextCreepName) === 0) {

                    const createResult = spawn.createCreep([CARRY, WORK, MOVE], nextCreepName);
                    if (createResult === 0) {
                        // creep created
                        // tslint:disable-next-line:no-console
                        console.log("Created Harvester in spawn: " + spawnName);
                    } else {
                        // tslint:disable-next-line:no-console
                        console.log("Failed to create creep: " + createResult);
                    }
                } else {
                    // tslint:disable-next-line:no-console
                    console.log("Can not create harvester in spawn: " + spawnName);
                }
            }

        }
    }
}
