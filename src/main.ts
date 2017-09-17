// Dependency Service
import { DependencyService } from "./containers/container";

import { DefaultCreepSettings } from "./constants/creepSettings";
import { Roles } from "./constants/roles";
import { TYPES } from "./constants/Types";

// Interfaces
import { IRoadController } from "./controllers/RoadController";
import { IRoomController } from "./controllers/RoomController";

export const loop = () => {
    // here we are... Now it is up to us to do something cool with screeps.

    const roadController = DependencyService.get<IRoadController>(TYPES.RoadController);
    roadController.updateRoadsForMyRooms();

    const roomController = DependencyService.get<IRoomController>(TYPES.RoomController);

    roomController.createCreepsForMyRooms();
    roomController.checkTechLevelOfMyRooms();
    roomController.doEconomicStuffInMyRooms();
};
