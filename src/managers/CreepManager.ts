import { inject, injectable } from "inversify";
import { ICreepManager } from "./Contract/ICreepManager";
import { MyCreeps } from "./Contract/MyCreeps";

@injectable()
export class CreepManager implements ICreepManager {

    public createCreeps(existingCreeps: Creep[], maximumCreeps: number, creepBaseName: string) {

        if (existingCreeps.length < maximumCreeps) {
            let i = 0;

            let nextCreepName = creepBaseName + i;
            while (Game.creeps[creepBaseName + i]) {
                i++;
                nextCreepName = creepBaseName + i;
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

    public resolveMyCreeps(): MyCreeps {
        const myCreeps = new MyCreeps();

        // tslint:disable-next-line:forin
        for (const creepName in Game.creeps) {
            const creep = Game.creeps[creepName];
            // tslint:disable-next-line:no-console
            console.log("I am " + creep.name);
            myCreeps.addCreep(creep.name, creep);
        }

        return myCreeps;
    }
}
