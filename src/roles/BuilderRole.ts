// tslint:disable:no-console

import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { CreepSettings } from "../constants/creepSettings";
import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IRoomManager } from "../managers/Contract/IRoomManager";
import { BuilderCreepMemory, RoadBuilderCreepMemory } from "../memory/CreepMemory";
import { IRoadBuilderRole } from "./BuilderRoles/RoadBuilderRole";
import { IBuilderRole } from "./Contract/IBuilderRole";

@injectable()
export class BuilderRole implements IBuilderRole {

    // Settings
    private creepSettings: CreepSettings;

    private creepManager: ICreepManager;
    private roomManager: IRoomManager;

    private roadBuilderRole: IRoadBuilderRole;

    constructor(
        @inject(TYPES.CreepSettings) creepSettings: CreepSettings,

        @inject(TYPES.CreepManager) creepManager: ICreepManager,
        @inject(TYPES.RoomManager) roomManager: IRoomManager,

        @inject(TYPES.BuilderRoles.RoadBuilderRole) roadBuilderRole: IRoadBuilderRole,
    ) {
        this.creepSettings = creepSettings;

        this.creepManager = creepManager;
        this.roomManager = roomManager;

        this.roadBuilderRole = roadBuilderRole;
    }

    public updateBuilderTypes(room: Room, buildingCreeps: Creep[]): void {
        const roomCreeps = buildingCreeps.slice();

        const buildersWithoutType = _.remove(roomCreeps,
            (creep) =>
                !(creep.memory as BuilderCreepMemory).buildingType ||
                (creep.memory as BuilderCreepMemory).buildingType === "Unspecified");

        const roadBuilders = _.remove(roomCreeps,
            (creep) => (creep.memory as BuilderCreepMemory).buildingType === "RoadBuilder");

        if (roadBuilders.length <= this.creepSettings.builderCreeps.roadBuildersPerRoom) {
            // we want roads, so lets claim some builders without type as road builders
            if (buildersWithoutType.length > 0) {
                const builder = buildersWithoutType.pop();
                this.roadBuilderRole.flagBuilderCreepAsRoadBuilder(builder);
            }
        }

    }

    public performBuildingTasks(buildingCreeps: Creep[]): void {
        const roomCreeps = buildingCreeps.slice();

        const roadBuilders = _.remove(roomCreeps,
            (creep) =>
                (creep.memory as BuilderCreepMemory).buildingType === "RoadBuilder");

        this.doRoadBuilderStuff(roadBuilders);

        for (const creep in roomCreeps) {
            // Simple builder shall at least help building extensions, dont you think?
        }
    }

    // Todo: reduce cyclomatic complexity !
    private doRoadBuilderStuff(roadBuilders: Creep[]) {

        for (const creep of roadBuilders) {
            this.performRoadBulding(creep);
        }
    }

    private performRoadBulding(creep: Creep) {
        this.roadBuilderRole.updateRoadBuilderCreepTask(creep);
        this.roadBuilderRole.performRoadBulding(creep);
    }
}
