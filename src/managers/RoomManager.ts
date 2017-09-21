import { inject, injectable } from "inversify";
import { Roles } from "../constants/roles";
import { TYPES } from "../constants/Types";

import { CreepSettings } from "../constants/creepSettings";
import { CreepMemory } from "../memory/CreepMemory";
import { IBuilderRole } from "../roles/Contract/IBuilderRole";
import { IHarvesterRole } from "../roles/Contract/IHarvesterRole";
import { IUpgraderRole } from "../roles/Contract/IUpgraderRole";
import { ICreepManager } from "./Contract/ICreepManager";
import { IRoomManager } from "./Contract/IRoomManager";

import { RoomMemory } from "../memory/RoomMemory";

// tslint:disable:no-console
// tslint:disable:forin

@injectable()
export class RoomManager implements IRoomManager {

    // Managers
    private creepManager: ICreepManager;

    constructor(
        @inject(TYPES.CreepManager) creepManager: ICreepManager) {
        this.creepManager = creepManager;
    }

    public getRoomMemory(room: Room): RoomMemory {
        return room.memory as RoomMemory;
    }

    public getRoomEnergyLevel(room: Room): number {

        if (room.energyCapacityAvailable < 400) {
            return 0;
        }

        if (room.energyCapacityAvailable >= 400 &&
            room.energyCapacityAvailable < 550) {
            return 1;
        }

        if (room.energyCapacityAvailable >= 550 &&
            room.energyCapacityAvailable < 800) {
            return 2;
        }

        if (room.energyCapacityAvailable >= 800 &&
            room.energyCapacityAvailable < 1300) {
            return 3;
        }

        if (room.energyCapacityAvailable >= 1300) {
            return 4;
        }
        // no energy? Is it even my room?
        return -1;
    }

    public getSpawnsInRoom(room: Room): StructureSpawn[] {
        const spawnsInRoom: StructureSpawn[] = _.filter(Game.spawns, (spawn) => spawn.room === room);
        return spawnsInRoom;
    }

    public getAvailableSpawnsInRoom(room: Room, creepParts: string[]): StructureSpawn[] {
        const costs = this.creepManager.getCreepCosts(creepParts);

        const energyInExtensions = this.getExtensionsInRoom(room).reduce((pv, cv, ci, array) => pv += cv.energy, 0);

        const availableSpawns: StructureSpawn[] =
            _.filter(Game.spawns, (spawn) =>
                spawn.room === room &&
                spawn.energy >= (costs - energyInExtensions) &&
                spawn.spawning === null);
        return availableSpawns;
    }

    public getStructuresInRoom(room: Room, additionalFilter?: (structure: Structure) => boolean): Structure[] {
        const structures =
            _.filter(Game.structures,
                (structure) =>
                    structure.room === room &&
                    (additionalFilter ? additionalFilter(structure) : true));
        return structures;
    }

    public getExtensionsInRoom(room: Room): StructureExtension[] {
        const structures: StructureExtension[] =
            _.filter(Game.structures,
                (struct) =>
                    struct.room === room &&
                    struct.structureType === STRUCTURE_EXTENSION) as StructureExtension[];
        return structures;
    }

    public createHarvesterInRoom(energyLevel: number, room: Room) {
        const creepParts = HarvesterParts[energyLevel];
        const availableSpawns = this.getAvailableSpawnsInRoom(room, creepParts);

        if (availableSpawns.length > 0) {
            console.log("We need some harvesters in room " + room.name);
            const harvesterBaseName = `${Roles.CREEP_HARVERSTER_ROLE}_Harry_${room.name}_`;
            const creepName = this.creepManager.getNextCreepName(harvesterBaseName);
            console.log("Creating harverster in room with name: " + creepName);
            this.createCreep(
                creepName,
                creepParts,
                { role: Roles.CREEP_HARVERSTER_ROLE, techLevel: energyLevel },
                availableSpawns);
        }
    }

    public createUpgraderInRoom(energyLevel: number, room: Room) {
        const creepParts = UpdaterParts[energyLevel];

        const availableSpawns = this.getAvailableSpawnsInRoom(room, creepParts);
        if (availableSpawns.length > 0) {
            console.log("We need some upgraders in room " + room.name);
            const upgraderBaseName = `${Roles.CREEP_UPGRADER_ROLE}_Uwe_${room.name}_`;
            const creepName = this.creepManager.getNextCreepName(upgraderBaseName);
            this.createCreep(
                creepName,
                creepParts,
                { role: Roles.CREEP_UPGRADER_ROLE, techLevel: energyLevel },
                availableSpawns);
        }
    }

    public createBuilderInRoom(energyLevel: number, room: Room) {
        const creepParts = BuilderParts[energyLevel];

        const availableSpawns = this.getAvailableSpawnsInRoom(room, creepParts);
        if (availableSpawns.length > 0) {
            console.log("We need some more builders in room " + room.name);
            const baseName = `${Roles.CREEP_BUILDER_ROLE}_Bernd_${room.name}_`;
            const creepName = this.creepManager.getNextCreepName(baseName);
            this.createCreep(
                creepName,
                creepParts,
                { role: Roles.CREEP_BUILDER_ROLE, techLevel: energyLevel },
                availableSpawns);
        }
    }

    public getConstructionSitesInRoom(room: Room): ConstructionSite[] {
        return _.filter(Game.constructionSites, (site) => site.room === room);
    }

    /**
     * Returns a construction site for an extension of the room (first or default... may return null or undefined)
     */
    public getExtensionConstructionSiteOfRoom(room: Room): ConstructionSite {
        const cs = this.getConstructionSitesInRoom(room);
        return _.find(cs, (site) => site.structureType === STRUCTURE_EXTENSION);
    }

    // tslint:disable-next-line:max-line-length
    // TODO: When we reach room controller level 7 we will get a problem: 2 Spawns are possible to be placed.
    public updateRoomExtensions(room: Room) {

        if (this.getExtensionConstructionSiteOfRoom(room)) {
            // tslint:disable-next-line:max-line-length
            // there is already a construction site for an extension. Let's just say we want to build one after another...
            return;
        }

        const ctrl = room.controller;
        if (ctrl.my) {
            let maxExtensions = 0;
            switch (ctrl.level) {
                case 0:
                case 1:
                    break;
                case 2:
                    // 5 Extensions!
                    maxExtensions = 5;
                    break;
                case 3:
                    maxExtensions = 10;
                    break;
                case 4:
                    maxExtensions = 20;
                    break;
            }

            if (!this.areExtensionsMaxedInRoom(room, maxExtensions)) {
                console.log(maxExtensions);
                this.createExtensionConstructionSiteInRoom(room);
            }

        } else {
            console.log("Room extensions can not be updated: This is not my room: " + room.name);
        }
    }

    private createCreep(
        creepName: string,
        creepParts: string[],
        creepMemory: Pick<CreepMemory, keyof CreepMemory>,
        availableSpawns: StructureSpawn[]): void {

        for (const spawn of availableSpawns) {
            const createResult =
                this.creepManager.createCreep(
                    creepName,
                    creepParts,
                    creepMemory,
                    spawn);

            if (createResult === 0) {
                break;
            } else {
                // tslint:disable-next-line:max-line-length
                console.log("Failed to create creep with tech level " + creepMemory.techLevel + " in spawn " + spawn.name + ". Error code is: " + createResult);
            }
        }
    }

    private areExtensionsMaxedInRoom(room: Room, maxExtensions: number): boolean {
        const extensions =
            this.getStructuresInRoom(room, (structure) => structure.structureType === STRUCTURE_EXTENSION);
        if (extensions.length < maxExtensions) {
            return false;
        }
        return true;
    }

    private createExtensionConstructionSiteInRoom(room: Room): void {
        console.log("Placing a new construction site in room '" + room.name + "'");

        let x = 0;
        let y = 0;
        const spawns = this.getSpawnsInRoom(room);
        if (spawns.length > 0) {
            const sp = spawns[0].pos;
            let direction: "right" | "top" | "left" | "bottom" = "right";

            x = sp.x;
            y = sp.y;
            let step: number = 1;
            let currentRepeats: number = 1;

            do {
                step--;
                switch (direction) {
                    case "left":
                        x -= 3;
                        break;
                    case "right":
                        x += 3;
                        break;
                    case "top":
                        y -= 3;
                        break;
                    case "bottom":
                        y += 3;
                        break;
                }

                if (step === 0) {
                    switch (direction) {
                        case "left":
                            direction = "bottom";
                            break;
                        case "right":
                            direction = "top";
                            break;
                        case "top":
                            direction = "left";
                            currentRepeats += 1;
                            break;
                        case "bottom":
                            direction = "right";
                            currentRepeats += 1;
                            break;
                    }
                    step = currentRepeats;
                }
                if (x > 0 && x < 50 && y > 0 && y < 50) {
                    const stuffAt = room.lookAt(x, y);
                    if (
                        _.find(stuffAt, (s) =>
                            s.type === LOOK_TERRAIN &&
                            s.terrain === "plain" ||
                            s.terrain === "swamp") &&

                        !_.find(stuffAt, (s) => s.type === LOOK_CONSTRUCTION_SITES) &&

                        !_.find(stuffAt, (s) => s.type === LOOK_CREEPS) &&

                        !_.find(stuffAt, (s) =>
                            s.type === LOOK_STRUCTURES &&
                            s.structure.structureType !== STRUCTURE_ROAD)) {
                        // we can create an extension here!
                        room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                        break;
                    }
                }
            } while (x > 0 && x < 50 || y > 0 && y < 50);
        }
    }
}

// tslint:disable-next-line:interface-name
interface CreepPartsMap {
    [roomTechLevel: number]: string[];
}

/**
 * Nur zum Resourcen sammeln!
 */
const HarvesterParts: CreepPartsMap = {
    0: [WORK, CARRY, CARRY, MOVE, MOVE],
    1: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    2: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    3: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    4: [WORK, WORK, WORK, WORK, WORK, WORK,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
};

/**
 * Zum Updaten
 */
const UpdaterParts: CreepPartsMap = {
    0: [WORK, CARRY, CARRY, MOVE, MOVE],
    1: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    2: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    3: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    4: [WORK, WORK, WORK, WORK, WORK, WORK,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
};

/**
 * Zum Bauen
 */
const BuilderParts: CreepPartsMap = {
    0: [WORK, CARRY, CARRY, MOVE, MOVE],
    1: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    2: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    3: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    4: [WORK, WORK, WORK, WORK, WORK, WORK,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
};

export default RoomManager;
