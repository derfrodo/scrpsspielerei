import * as _ from "lodash";

import { inject, injectable } from "inversify";

import { IRoomManager } from "./Contract/IRoomManager";

export class RoomManager implements IRoomManager {
    public createCreepsForRoom(room: Room): void {
        // We need creeps according to room (?) tech level
        const energyLevel = this.getRoomEnergyLevel(room);

        switch (energyLevel) {
            case 0:
                this.createCreepsLevelOne(room);
                break;
            case 1:
                this.createCreepsLevelTwo(room);
                break;
            case 2:
                this.createCreepsLevelThree(room);
                break;
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

    private createCreepsLevelOne(room: Room): void {
        if (room.energyAvailable < 200) {
            // not enough energy
            return;
        }
        const spawnsInRoom: StructureSpawn[] = _.filter(Game.spawns, (spawn) => spawn.room === room);
    }

    private createCreepsLevelTwo(room: Room): void {
        if (room.energyAvailable < 500) {
            return;
        }
    }

    private createCreepsLevelThree(room: Room): void {
        // todo: let's create another tech level.
        this.createCreepsLevelTwo(room);
    }

    private getSpawnsInRoom(room: Room): StructureSpawn[] {
        const spawnsInRoom: StructureSpawn[] = _.filter(Game.spawns, (spawn) => spawn.room === room);
        return spawnsInRoom;
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
}

// tslint:disable-next-line:interface-name
interface CreepPartsMap {
    [roomTechLevel: number]: string[];
}

const HarvesterParts: CreepPartsMap = {
    0: [WORK, WORK, CARRY, MOVE, MOVE],
    1: [WORK, WORK, WORK, WORK, CARRY, MOVE],
    2: [WORK, WORK, WORK, WORK, CARRY, MOVE],
};

const UpdaterParts: CreepPartsMap = {
    0: [WORK, WORK, CARRY, MOVE, MOVE],
    1: [WORK, WORK, WORK, WORK, CARRY, MOVE],
    2: [WORK, WORK, WORK, WORK, CARRY, MOVE],
};

export default RoomManager;
