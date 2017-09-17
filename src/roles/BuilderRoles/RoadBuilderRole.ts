// tslint:disable:no-console
import { inject, injectable } from "inversify";
import { TYPES } from "../../constants/Types";

import { IRoomManager } from "../../managers/Contract/IRoomManager";
import { RoadBuilderCreepMemory } from "../../memory/CreepMemory";

export interface IRoadBuilderRole {
    /**
     * Updates the road builder creep's current task
     */
    updateRoadBuilderCreepTask(creep: Creep);

    /**
     * Performs the current task of the passed road builder creep
     */
    performRoadBulding(creep: Creep);

    /**
     * Sets the builder creep to be a road builder!
     */
    flagBuilderCreepAsRoadBuilder(creep: Creep);
}

@injectable()
export class RoadBuilderRole implements IRoadBuilderRole {

    private roomManager: IRoomManager;
    constructor( @inject(TYPES.RoomManager) roomManager: IRoomManager) {
        this.roomManager = roomManager;
    }

    public updateRoadBuilderCreepTask(creep: Creep) {
        const rbm = creep.memory as RoadBuilderCreepMemory;

        // set creep task:
        if (rbm.currentRoadBuilderTask === "Initializing") {
            // TODO: We might want to go to the selected start first?
            rbm.currentRoadBuilderTask = "GotoStart";
        }

        if (rbm.currentRoadBuilderTask === "Harvesting" &&
            creep.carry.energy === creep.carryCapacity) {
            rbm.currentRoadBuilderTask = "GotoStart";

        } else if (rbm.currentRoadBuilderTask === "GotoStart" &&
            creep.carry.energy > 0) {

            const sp = rbm.roadBuildingStart;
            if (creep.pos.getRangeTo(sp.x, sp.y) <= 1 || rbm.lastConstructionSitePosition) {
                rbm.currentRoadBuilderTask = "Building";
            }
        } else if ((rbm.currentRoadBuilderTask === "Building" ||
            rbm.currentRoadBuilderTask === "GotoStart") &&
            creep.carry.energy === 0) {
            rbm.currentRoadBuilderTask = "Harvesting";
        }
    }

    public performRoadBulding(creep: Creep) {
        const rbm = creep.memory as RoadBuilderCreepMemory;

        // do the real stuff!
        if (rbm.currentRoadBuilderTask === "Harvesting") {
            const source: Source = creep.pos.findClosestByPath(FIND_SOURCES) as Source;
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source.pos, RoadBuilderMoveToOps);
            }
        } else {
            const ecs = this.roomManager.getExtensionConstructionSiteOfRoom(creep.room);
            if (ecs) {
                // alway prefer to build an extension!
                if (creep.build(ecs) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(ecs.pos, RoadBuilderMoveToOps);
                }
            } else if (rbm.currentRoadBuilderTask === "GotoStart") {
                const sp = rbm.roadBuildingStart;
                creep.moveTo(sp.x, sp.y);
            } else if (rbm.currentRoadBuilderTask === "Building") {
                this.buildRoad(creep);
            }
            if (creep.carry.energy === 0 && creep.ticksToLive < 200) {
                creep.say("I have to go now.");
                creep.suicide();
            }
        }
    }

    public flagBuilderCreepAsRoadBuilder(builderCreep: Creep) {
        console.log("Set " + builderCreep.name + " to be a road builder!");

        const rbm = (builderCreep.memory as RoadBuilderCreepMemory);
        rbm.buildingType = "RoadBuilder";

        rbm.currentRoadBuilderTask = "Initializing";

        const closestSpawn = builderCreep.pos.findClosestByPath(FIND_MY_SPAWNS) as Spawn;
        const closestEnergy = builderCreep.pos.findClosestByPath(FIND_SOURCES) as Source;

        const sp = closestSpawn.pos;
        const ep = closestEnergy.pos;

        rbm.roadBuildingStart = { x: ep.x, y: ep.y };
        rbm.roadBuldingStartType = "energy";

        rbm.roadBuildingDestination = { x: sp.x, y: sp.y };
        rbm.roadBuildingDestinationType = "spawn";
    }

    private buildRoad(creep: Creep) {
        const rbm = creep.memory as RoadBuilderCreepMemory;

        if (rbm.lastConstructionSitePosition) {
            const p = rbm.lastConstructionSitePosition;
            const lat: LookAtResult[] = creep.room.lookAt(p.x, p.y);
            const cs = _.find(lat, (lar) => lar.type === LOOK_CONSTRUCTION_SITES);
            if (cs) {
                if (creep.build(cs.constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(cs.constructionSite.pos);
                }
                return;
            } else {
                rbm.lastConstructionSitePosition = undefined;
            }
        }

        const dp = rbm.roadBuildingDestination;
        const path = creep.pos.findPathTo(dp.x, dp.y);
        for (const step of path) {
            const lat: LookAtResult[] = creep.room.lookAt(step.x, step.y);
            const cs = _.find(lat, (lar) => lar.type === LOOK_CONSTRUCTION_SITES);
            const strct = _.find(lat, (lar) => lar.type === LOOK_STRUCTURES);

            if (cs) {
                rbm.lastConstructionSitePosition = { x: cs.constructionSite.pos.x, y: cs.constructionSite.pos.y };
                if (creep.build(cs.constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(cs.constructionSite.pos);
                }
                return;
            } else if (!strct) {
                // let's place a construction site here!
                if (creep.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD) === 0) {
                    rbm.lastConstructionSitePosition = { x: step.x, y: step.y };
                    if (creep.pos.getRangeTo(step.x, step.y) > 3) {
                        creep.moveTo(step.x, step.y);
                    }
                    return;
                }
            }
        }

        // if we reach this point, the whole way has already roads.
        // So lets update our next target:
        this.updatePath(creep);

        rbm.currentRoadBuilderTask = "GotoStart";
        const sp = rbm.roadBuildingStart;
        creep.moveTo(sp.x, sp.y);
    }

    /**
     * Will update the waypoints of the passed road builder creep
     */
    private updatePath(creep: Creep) {
        const rbm = creep.memory as RoadBuilderCreepMemory;

        const sources = creep.room.find(FIND_SOURCES) as Source[];
        const source = sources[_.random(0, sources.length - 1, false)];

        const ep = source.pos;
        rbm.roadBuildingStart = { x: ep.x, y: ep.y };
        rbm.roadBuldingStartType = "energy";

        switch (rbm.roadBuildingDestinationType) {
            case "spawn":
                const cp = creep.room.controller.pos;
                // controller as destination
                rbm.roadBuildingDestination = { x: cp.x, y: cp.y };
                rbm.roadBuildingDestinationType = "controller";
                break;
            case "energy":
            case "controller":
                const closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS) as Spawn;
                const sp = closestSpawn.pos;

                rbm.roadBuildingDestination = { x: sp.x, y: sp.y };
                rbm.roadBuildingDestinationType = "spawn";
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
