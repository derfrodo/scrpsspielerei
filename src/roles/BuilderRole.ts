// tslint:disable:forin
// tslint:disable:no-console

import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { CreepSettings } from "../constants/creepSettings";
import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IRoomManager } from "../managers/Contract/IRoomManager";
import { BuilderCreepMemory } from "../memory/CreepMemory";
import { IBuilderRole } from "./Contract/IBuilderRole";

@injectable()
export class BuilderRole implements IBuilderRole {

    private roomManager: IRoomManager;
    private creepManager: ICreepManager;

    constructor(
        @inject(TYPES.RoomManager) roomManager: IRoomManager,
        @inject(TYPES.CreepManager) creepManager: ICreepManager,
    ) {
        this.roomManager = roomManager;
        this.creepManager = creepManager;
    }

    public updateBuildingTasks(buildingCreeps: Creep[]): void {
        for (const creepIndex in buildingCreeps) {
            const creep = buildingCreeps[creepIndex];
            this.updateBuildingTask(creep);
        }
    }

    public performBuildingTasks(buildingCreeps: Creep[]): void {
        for (const creepIndex in buildingCreeps) {
            const creep = buildingCreeps[creepIndex];
            this.performBuildingTask(creep);
        }
    }

    private updateBuildingTask(creep: Creep) {
        const bm = creep.memory as BuilderCreepMemory;
        switch (bm.status) {
            case "Building":
                if (creep.carry.energy === 0) {
                    bm.status = "Harvesting";
                }
                break;
            default:
                bm.status = "Harvesting";
            case "Harvesting":
                if (creep.carry.energy === creep.carryCapacity) {
                    bm.status = "Building";
                }
                break;
        }
    }

    private performBuildingTask(creep: Creep) {
        const bm = creep.memory as BuilderCreepMemory;

        switch (bm.status) {
            case "Harvesting":
                this.creepManager.harvestFromClosestSource(creep, RoadBuilderMoveToOps);
                break;
            case "Building":
                const ecs = this.roomManager.getExtensionConstructionSiteOfRoom(creep.room);
                if (ecs) {
                    if (creep.build(ecs) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(ecs.pos, RoadBuilderMoveToOps);
                    }
                    break;
                }

                const cs: ConstructionSite =
                    creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) as ConstructionSite;
                if (cs) {
                    if (creep.build(cs) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(cs.pos, RoadBuilderMoveToOps);
                    }
                } else {
                    // search for near structures to be repaired.

                    const closest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (struct: Structure & { my: boolean }) => {
                            return struct.hits < struct.hitsMax;
                        },
                    }) as Structure;

                    if (closest) {
                        if (creep.repair(closest) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(closest.pos, RoadBuilderMoveToOps);
                        }
                    } else {
                        const closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS) as Spawn;
                        if (closestSpawn) {
                            creep.moveTo(closestSpawn.pos, RoadBuilderMoveToOps);
                        }
                    }
                }
                break;
        }
    }
}
const RoadBuilderMoveToOps: MoveToOpts = {
    visualizePathStyle: {
        fill: "transparent",
        lineStyle: "dashed",
        opacity: .1,
        stroke: "#f0f",
        strokeWidth: .12,
    },
};
