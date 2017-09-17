// The container itself
import { Container } from "inversify";

import { TYPES } from "../constants/Types";

// Dataclasses and/or Settings:
import { CreepSettings } from "../constants/creepSettings";

// Interfaces
import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IRoomManager } from "../managers/Contract/IRoomManager";
import { IHarvesterRole } from "../roles/Contract/IHarvesterRole";
import { IUpgraderRole } from "../roles/Contract/IUpgraderRole";

// Implementations
import { IRoomController, RoomController } from "../controllers/RoomController";
import { CreepManager } from "../managers/CreepManager";
import { RoomManager } from "../managers/RoomManager";
import { HarversterRole } from "../roles/HarvesterRole";
import { UpgraderRole } from "../roles/UpgraderRole";

// Service Container
export const GeneralContainer = new Container();

// Settings
GeneralContainer.bind<CreepSettings>(TYPES.CreepSettings).toConstantValue(new CreepSettings());

// Controller
GeneralContainer.bind<IRoomController>(TYPES.RoomController).to(RoomController);

// Manager
GeneralContainer.bind<ICreepManager>(TYPES.CreepManager).to(CreepManager).inSingletonScope();
GeneralContainer.bind<IRoomManager>(TYPES.RoomManager).to(RoomManager);

// Roles
GeneralContainer.bind<IHarvesterRole>(TYPES.HarvesterRole).to(HarversterRole);
GeneralContainer.bind<IUpgraderRole>(TYPES.UpgraderRole).to(UpgraderRole);

export default GeneralContainer;
