import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { DefaultCreepSettings } from "./../constants/creepSettings";
import { Roles } from "./../constants/roles";

import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IRoomManager } from "../managers/Contract/IRoomManager";
import { HarvesterCreepMemory } from "../memory/CreepMemory";
import { IHarvesterRole } from "./Contract/IHarvesterRole";

@injectable()
export class HarversterRole implements IHarvesterRole {

    private roomManager: IRoomManager;
    private creepManager: ICreepManager;

    public constructor(
        @inject(TYPES.CreepManager) creepManager: ICreepManager,
        @inject(TYPES.RoomManager) roomManager: IRoomManager) {
        this.creepManager = creepManager;
        this.roomManager = roomManager;
    }

    public harvestEnergy(harvestingCreeps: Creep[]) {
        // tslint:disable-next-line:forin
        for (const creepIndex in harvestingCreeps) {
            const creep = harvestingCreeps[creepIndex];
            this.harvestEnergyForCreep(creep);
        }
    }
    private getMemory(creep: Creep): HarvesterCreepMemory {
        return creep.memory as HarvesterCreepMemory;
    }

    private harvestEnergyForCreep(creep: Creep) {
        this.updateStatus(creep);
        this.performRole(creep);
    }

    private performRole(creep: Creep) {
        const hm = this.getMemory(creep);
        switch (hm.status) {
            case "Harvesting":
                if (creep.carry.energy === 0 && creep.ticksToLive < 200) {
                    creep.say("I have to go now.");
                    creep.suicide();
                }

                const source: Source = creep.pos.findClosestByPath(FIND_SOURCES) as Source;
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source.pos, HarvesterCreepMoveOptions);
                }
                break;
            case "BringBack":
                this.bringBackEnergy(creep);
                break;
            case "Building":
                this.buildStuff(creep);
                break;
        }
    }

    private bringBackEnergy(creep: Creep) {
        const availableSpawns: Spawn[] =
            _.filter(creep.room.find(FIND_MY_SPAWNS) as Spawn[], (s) => s.energy < s.energyCapacity) as Spawn[];

        if (availableSpawns.length > 0) {
            if (creep.transfer(availableSpawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(availableSpawns[0].pos, HarvesterCreepMoveOptions);
            }
            return;
        }

        const availableExtensions: Extension[] =
            _.filter(creep.room.find(FIND_STRUCTURES) as Structure[],
                (s) => s.structureType === STRUCTURE_EXTENSION &&
                    (s as StructureExtension).energy <
                    (s as StructureExtension).energyCapacity) as StructureExtension[];

        if (availableExtensions.length > 0) {
            if (creep.transfer(availableExtensions[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(availableExtensions[0].pos, HarvesterCreepMoveOptions);
            }
            return;
        }
    }

    private buildStuff(creep: Creep) {
        const cs = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) as ConstructionSite;
        if (cs) {
            if (creep.build(cs) === ERR_NOT_IN_RANGE) {
                creep.moveTo(cs.pos, HarvesterCreepMoveOptions);
            }
        } else {
            const closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS) as Spawn;
            creep.moveTo(closestSpawn.pos, HarvesterCreepMoveOptions);
        }
    }

    private updateStatus(creep: Creep) {
        const hm = this.getMemory(creep);

        switch (hm.status) {
            case undefined:
                hm.status = "Harvesting";
                break;
            case "Harvesting":
                if (creep.carry.energy === creep.carryCapacity) {
                    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                        hm.status = "BringBack";
                    } else {
                        hm.status = "Building";
                    }
                }
                break;
            case "BringBack":
                if (creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
                    hm.status = "Building";
                }
                if (creep.carry.energy < 50) { hm.status = "Harvesting"; }
                break;
            case "Building":
                if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    hm.status = "BringBack";
                }
                if (creep.carry.energy === 0) { hm.status = "Harvesting"; }
                break;
        }
    }
}

const HarvesterCreepMoveOptions: MoveToOpts = {
    visualizePathStyle: {
        fill: "transparent",
        lineStyle: "dashed",
        opacity: .1,
        stroke: "#fff",
        strokeWidth: .15,
    },
};
