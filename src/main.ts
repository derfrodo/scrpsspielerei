import { DefaultCreepSettings } from "./constants/creepSettings";
import { Roles } from "./constants/roles";
import { HarversterRole } from "./harversterRole";

export const loop = () => {
    // here we are... Now it is up to us to do something cool with screeps.

    // TODO: Maybe a global store for creeps might be a good idea.
    const creeps = resolveMyCreeps();

    addHarvestersIfNeeded(creeps);

    const harversterRole = new HarversterRole();
    const harvestingCreeps = creeps.getOrCreateCreepArrayByRole(Roles.CREEP_HARVERSTER_ROLE);
    harversterRole.createHarvestersIfNeeded(harvestingCreeps);
    harversterRole.harvestEnergy(harvestingCreeps);
};

const addHarvestersIfNeeded = (creeps: MyCreeps) => {
    const harvestingCreeps = creeps.getOrCreateCreepArrayByRole(Roles.CREEP_HARVERSTER_ROLE);

    if (harvestingCreeps.length < DefaultCreepSettings.harverstersTargetCount) {
        const nextCreepName = `${Roles.CREEP_HARVERSTER_ROLE}_Harry`;

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
};

const resolveMyCreeps = (): MyCreeps => {
    const myCreeps = new MyCreeps();

    // tslint:disable-next-line:forin
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        // tslint:disable-next-line:no-console
        console.log("I am " + creep.name);
        myCreeps.addCreep(creep.name, creep);
    }

    return myCreeps;
};

// tslint:disable-next-line:interface-over-type-literal
type CreepMap = { [roleName: string]: Creep[] };

class MyCreeps {

    /**
     * Creeps for harvesting energy for spawns
     */
    public readonly roles: CreepMap = {};

    public addCreep(name: string, creep: Creep) {
        const parts = name.split("_");

        if (parts && parts.length > 0) {
            const creeps = this.getOrCreateCreepArrayByRole(parts[0]);
            creeps.push(creep);
        }
    }

    public getOrCreateCreepArrayByRole(roleName: string) {
        let creeps: Creep[] = this.roles[roleName];

        if (!creeps) {
            creeps = [];
            this.roles[roleName] = creeps;
        }

        return creeps;
    }

}
