// reflect-metadata should be imported
// before any interface or other imports
// also it should be imported only once
// so that a singleton is created.
import "reflect-metadata";

// Der container:
import { Container } from "inversify";

import { TYPES } from "./constants/Types";

// Interfaces
import { ICreepManager } from "./managers/Contract/ICreepManager";
import { IRoomManager } from "./managers/Contract/IRoomManager";
import { IHarversterRole } from "./roles/Contract/IHarvesterRole";
import { IUpgraderRole } from "./roles/Contract/IUpgraderRole";

// Implementations
import { CreepManager } from "./managers/CreepManager";
import { RoomManager } from "./managers/RoomManager";
import { HarversterRole } from "./roles/HarvesterRole";
import { UpgraderRole } from "./roles/UpgraderRole";

// Service Container
export const DependencyService = new Container();

DependencyService.bind<ICreepManager>(TYPES.CreepManager).to(CreepManager).inSingletonScope();
DependencyService.bind<IRoomManager>(TYPES.RoomManager).to(RoomManager);

DependencyService.bind<IHarversterRole>(TYPES.HarvesterRole).to(HarversterRole);
DependencyService.bind<IUpgraderRole>(TYPES.UpgraderRole).to(UpgraderRole);

export default DependencyService;
