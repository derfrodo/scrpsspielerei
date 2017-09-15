import { DefaultCreepSettings } from "./constants/creepSettings";
import { Roles } from "./constants/roles";
import { CreepManager, MyCreeps } from "./managers/CreepManager";
import { HarversterRole } from "./roles/HarvesterRole";

export const loop = () => {
    // here we are... Now it is up to us to do something cool with screeps.

    const creepManager: CreepManager = new CreepManager();

    // TODO: Maybe a global store for creeps might be a good idea.
    const creeps = creepManager.resolveMyCreeps();

    const harversterRole = new HarversterRole();
    const harvestingCreeps = creeps.getOrCreateCreepArrayByRole(Roles.CREEP_HARVERSTER_ROLE);
    harversterRole.createHarvestersIfNeeded(harvestingCreeps);
    harversterRole.harvestEnergy(harvestingCreeps);
};
