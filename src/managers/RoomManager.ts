import { inject, injectable } from "inversify";
import { Roles } from "../constants/roles";
import { TYPES } from "../constants/Types";

import { CreepSettings } from "../constants/creepSettings";
import { ICreepManager } from "./Contract/ICreepManager";
import { IRoomManager } from "./Contract/IRoomManager";

// tslint:disable:no-console

@injectable()
export class RoomManager implements IRoomManager {

    private creepManager: ICreepManager;
    private creepSettings: CreepSettings;

    constructor(
        @inject(TYPES.CreepManager) creepManager: ICreepManager,
        @inject(TYPES.CreepSettings) creepSettings: CreepSettings) {
        this.creepManager = creepManager;
        this.creepSettings = creepSettings;
    }

    public createCreepsForMyRooms(): void {
        const rooms = Game.rooms;

        // tslint:disable-next-line:forin
        for (const roomIndex in rooms) {
            const room = rooms[roomIndex];
            this.createCreepsForRoom(room);
        }
    }

    public createCreepsForRoom(room: Room): void {
        // We need creeps according to room (?) tech / energy level
        const energyLevel = this.getRoomEnergyLevel(room);

        if (energyLevel >= 0) {
            // harvesters first!
            const creeps = this.creepManager.getCreepsForRoom(room);

            const harvesters = this.creepManager.getHarvesters(creeps);
            const upgrader = this.creepManager.getUpgrader(creeps);

            if (harvesters.length < this.creepSettings.harvestersPerRoom) {
                // we need to create all our harvesters first and some are missing!
                console.log("We need some harvesters in room " + room.name);
                this.createHarvesterInRoom(energyLevel, room);

                // maybe we should check if all spawns are busy now with creating harvesters?
                // otherwise a spawn may be available but not used during at least one tick
            } else if (upgrader.length < this.creepSettings.upgradersPerRoom) {
                // after harvesters we want to build some upgraders...
                console.log("We need some upgraders in room " + room.name);
                this.createUpgraderInRoom(energyLevel, room);

                // maybe we should check if all spawns are busy now with creating harvesters?
                // otherwise a spawn may be available but not used during at least one tick
            }

        } else {
            // tslint:disable-next-line:no-console
            console.log("Energy level is less than 0");
        }
    }

    public createConstructionSite(room: Room) {
        const spawns = this.getSpawnsInRoom(room);
        // room.createConstructionSite(room);

        const extensions = this.getExtensionsInRoom(room);
    }

    public getRoomEnergyLevel(room: Room): number {

        if (room.energyCapacityAvailable === 300) {
            return 0;
        }

        if (room.energyCapacityAvailable <= 550) {
            return 1;
        }

        if (room.energyCapacityAvailable > 550) {
            return 2;
        }

        // no energy? Is it even my room?
        return -1;
    }
    private getSpawnsInRoom(room: Room): StructureSpawn[] {
        const spawnsInRoom: StructureSpawn[] = _.filter(Game.spawns, (spawn) => spawn.room === room);
        return spawnsInRoom;
    }

    private getAvailableSpawnsInRoom(room: Room, creepParts: string[]): StructureSpawn[] {
        const costs = this.creepManager.getCosts(creepParts);
        const availableSpawns: StructureSpawn[] =
            _.filter(Game.spawns, (spawn) =>
                spawn.room === room &&
                spawn.energy >= costs &&
                spawn.spawning === null);
        return availableSpawns;
    }

    private getStructuresInRoom(room: Room): Structure[] {
        const structures: Structure[] = _.filter(Game.structures, (struct) => struct.room === room);
        return structures;
    }

    private getExtensionsInRoom(room: Room): StructureExtension[] {
        const structures: StructureExtension[] =
            _.filter(Game.structures,
                (struct) =>
                    struct.room === room &&
                    struct.structureType === STRUCTURE_EXTENSION) as StructureExtension[];
        return structures;
    }

    private createHarvesterInRoom(energyLevel: number, room: Room) {
        const creepParts = HarvesterParts[energyLevel];
        const availableSpawns = this.getAvailableSpawnsInRoom(room, creepParts);

        if (availableSpawns.length > 0) {

            const harvesterBaseName = `${Roles.CREEP_HARVERSTER_ROLE}_${room.name}_Harry_`;
            const creepName = this.createNextCreepName(harvesterBaseName);
            console.log("Creating harverster in room with name: " + creepName);
            this.createCreep(
                creepName,
                creepParts,
                { role: Roles.CREEP_HARVERSTER_ROLE, techLevel: energyLevel },
                availableSpawns);
        }
    }

    private createUpgraderInRoom(energyLevel: number, room: Room) {
        const creepParts = UpdaterParts[energyLevel];

        const availableSpawns = this.getAvailableSpawnsInRoom(room, creepParts);
        if (availableSpawns.length > 0) {

            const upgraderBaseName = `${Roles.CREEP_UPGRADER_ROLE}_${room.name}_Uwe_`;
            const creepName = this.createNextCreepName(upgraderBaseName);
            this.createCreep(
                creepName,
                creepParts,
                { role: Roles.CREEP_UPGRADER_ROLE, techLevel: energyLevel },
                availableSpawns);
        }
    }

    private createNextCreepName(creepBaseName: string): string {
        let nameIndex = 0;
        let creepName: string;
        do {
            nameIndex++;
            creepName = creepBaseName + nameIndex;
        } while (!this.creepManager.canCreateCreepWithName(creepName));
        return creepName;
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

}

// tslint:disable-next-line:interface-name
interface CreepPartsMap {
    [roomTechLevel: number]: string[];
}

/**
 * Nur zum Resourcen sammeln!
 */
const HarvesterParts: CreepPartsMap = {
    0: [WORK, CARRY, MOVE, MOVE],
    1: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    2: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
};

/**
 * Zum Updaten
 */
const UpdaterParts: CreepPartsMap = {
    0: [WORK, CARRY, MOVE, MOVE],
    1: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    2: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
};

export default RoomManager;
