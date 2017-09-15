import { inject, injectable } from "inversify";
import { ICreepManager } from "./Contract/ICreepManager";
import { MyCreeps } from "./Contract/MyCreeps";

@injectable()
export class CreepManager implements ICreepManager {

    public createCreeps(existingCreeps: Creep[], maximumCreeps: number, creepBaseName: string, creepParts: string[]) {

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

                if (spawn.canCreateCreep(creepParts, nextCreepName) === 0) {

                    const createResult = spawn.createCreep(creepParts, nextCreepName);
                    if (createResult === 0) {
                        // creep created
                        // tslint:disable-next-line:no-console
                        console.log("Creating creep in spawn: " + spawnName);
                    } else {
                        // tslint:disable-next-line:no-console
                        console.log("Failed to create creep: " + createResult);
                    }
                } else {
                    // tslint:disable-next-line:no-console
                    console.log("Can not create " + nextCreepName + " in spawn: " + spawnName);
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
}
