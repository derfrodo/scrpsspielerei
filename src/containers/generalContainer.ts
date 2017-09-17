// The container itself
import { Container } from "inversify";

import { TYPES } from "../constants/Types";

// Dataclasses and/or Settings:
import { CreepSettings } from "../constants/creepSettings";
import { RoomSettings } from "../constants/roomSettings";

// Interfaces
import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IRoomManager } from "../managers/Contract/IRoomManager";

// Implementations
import { IRoadController, RoadController } from "../controllers/RoadController";
import { IRoomController, RoomController } from "../controllers/RoomController";
import { CreepManager } from "../managers/CreepManager";
import { RoomManager } from "../managers/RoomManager";

// Service Container
export const GeneralContainer = new Container();

// Settings
GeneralContainer.bind<RoomSettings>(TYPES.RoomSettings).toConstantValue(new RoomSettings());
GeneralContainer.bind<CreepSettings>(TYPES.CreepSettings).toConstantValue(new CreepSettings());

// Controller
GeneralContainer.bind<IRoomController>(TYPES.RoomController).to(RoomController);
GeneralContainer.bind<IRoadController>(TYPES.RoadController).to(RoadController);

// Manager
GeneralContainer.bind<ICreepManager>(TYPES.CreepManager).to(CreepManager).inSingletonScope();
GeneralContainer.bind<IRoomManager>(TYPES.RoomManager).to(RoomManager);

export default GeneralContainer;
