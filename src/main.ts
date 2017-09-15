// Dependency Service
import { DependencyService } from "./container";

import { DefaultCreepSettings } from "./constants/creepSettings";
import { Roles } from "./constants/roles";
import { TYPES } from "./constants/Types";

// Interfaces
import { ICreepManager } from "./managers/Contract/ICreepManager";
import { IBuilderRole } from "./roles/Contract/IBuilderRole";
import { IHarversterRole } from "./roles/Contract/IHarvesterRole";

export const loop = () => {
    // here we are... Now it is up to us to do something cool with screeps.

    const creepManager = DependencyService.get<ICreepManager>(TYPES.CreepManager);

    // TODO: Maybe a global store for creeps might be a good idea.
    const creeps = creepManager.resolveMyCreeps();

    const harversterRole = DependencyService.get<IHarversterRole>(TYPES.HarvesterRole);
    const builderRole = DependencyService.get<IBuilderRole>(TYPES.BuilderRole);

    const harvestingCreeps = creeps.getOrCreateCreepArrayByRole(Roles.CREEP_HARVERSTER_ROLE);
    harversterRole.createHarvestersIfNeeded(harvestingCreeps);
    harversterRole.harvestEnergy(harvestingCreeps);
};
