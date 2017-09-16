// Dependency Service
import { DependencyService } from "./container";

import { DefaultCreepSettings } from "./constants/creepSettings";
import { Roles } from "./constants/roles";
import { TYPES } from "./constants/Types";

// Interfaces
import { ICreepManager } from "./managers/Contract/ICreepManager";
import { IRoomManager } from "./managers/Contract/IRoomManager";
import { IHarversterRole } from "./roles/Contract/IHarvesterRole";
import { IUpgraderRole } from "./roles/Contract/IUpgraderRole";

export const loop = () => {
    // here we are... Now it is up to us to do something cool with screeps.

    // const creepManager = DependencyService.get<ICreepManager>(TYPES.CreepManager);

    const roomManager = DependencyService.get<IRoomManager>(TYPES.RoomManager);
    roomManager.createCreepsForMyRooms();

};
