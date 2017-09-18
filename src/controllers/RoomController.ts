// tslint:disable:forin

import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { CreepSettings } from "../constants/creepSettings";
import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IRoomManager } from "../managers/Contract/IRoomManager";
import { CreepMemory } from "../memory/CreepMemory";
import { IBuilderRole } from "../roles/Contract/IBuilderRole";
import { IHarvesterRole } from "../roles/Contract/IHarvesterRole";
import { IUpgraderRole } from "../roles/Contract/IUpgraderRole";

export interface IRoomController {
    /**
     * Create creeps for all my rooms
     */
    createCreepsForMyRooms(): void;

    /**
     * Do economic tasks in all of my rooms
     * This includes
     * harvesting energy,
     * (maybe some mining in the future),
     * upgrading contollers and structures,
     * (maybe building some structures in the future)
     */
    doEconomicStuffInMyRooms(): void;

    /**
     * Checks the tech level of my rooms.
     */
    checkTechLevelOfMyRooms();
}

@injectable()
export class RoomController implements IRoomController {

    // Settings
    private creepSettings: CreepSettings;

    // Managers
    private creepManager: ICreepManager;
    private roomManager: IRoomManager;

    // Roles
    private harvesterRole: IHarvesterRole;
    private upgraderRole: IUpgraderRole;
    private builderRole: IBuilderRole;

    constructor(
        @inject(TYPES.CreepSettings) creepSettings: CreepSettings,
        @inject(TYPES.RoomManager) roomManager: IRoomManager,
        @inject(TYPES.CreepManager) creepManager: ICreepManager,
        @inject(TYPES.HarvesterRole) harvesterRole: IHarvesterRole,
        @inject(TYPES.UpgraderRole) upgraderRole: IUpgraderRole,
        @inject(TYPES.BuilderRole) builderRole: IBuilderRole) {
        this.creepSettings = creepSettings;

        this.roomManager = roomManager;
        this.creepManager = creepManager;

        this.harvesterRole = harvesterRole;
        this.upgraderRole = upgraderRole;
        this.builderRole = builderRole;
    }

    public createCreepsForMyRooms(): void {
        const rooms = Game.rooms;

        for (const roomIndex in rooms) {
            const room = rooms[roomIndex];
            this.createCreepsForRoom(room);
        }
    }

    public doEconomicStuffInMyRooms(): void {
        const rooms = Game.rooms;

        for (const roomIndex in rooms) {
            const room = rooms[roomIndex];
            this.doEconomicStuffInRoom(room);
        }
    }

    public checkTechLevelOfMyRooms() {
        const rooms = Game.rooms;

        for (const roomIndex in rooms) {
            const room = rooms[roomIndex];
            this.checkTechLevel(room);
        }
    }

    public createCreepsForRoom(room: Room): void {
        // We need creeps according to room (?) tech / energy level
        const energyLevel = this.roomManager.getRoomEnergyLevel(room);

        if (energyLevel >= 0) {
            // harvesters first!
            const creeps = this.creepManager.getCreepsForRoom(room);

            const harvesters = this.creepManager.getHarvesters(creeps);
            const upgraders = this.creepManager.getUpgraders(creeps);
            const builders = this.creepManager.getBuilders(creeps);

            if (harvesters.length < this.creepSettings.harvestersPerRoom) {
                // we need to create all our harvesters first and some are missing!
                this.roomManager.createHarvesterInRoom(energyLevel, room);

                // maybe we should check if all spawns are busy now with creating harvesters?
                // otherwise a spawn may be available but not used during at least one tick
            } else if (builders.length < this.creepSettings.buildersPerRoom) {
                this.roomManager.createBuilderInRoom(energyLevel, room);
            } else if (upgraders.length < this.creepSettings.upgradersPerRoom) {
                // after harvesters we want to build some upgraders...
                this.roomManager.createUpgraderInRoom(energyLevel, room);

                // maybe we should check if all spawns are busy now with creating upgraders?
                // otherwise a spawn may be available but not used during at least one tick
            } else {
                // all needed creeps have been created. Maybe we want to replace a creep?
                if (energyLevel > 0 &&
                    room.energyAvailable === room.energyCapacityAvailable) {
                    let lowLevelCreep =
                        _.find(harvesters, (creep) =>
                            (creep.memory as CreepMemory).techLevel < energyLevel);
                    if (!lowLevelCreep) {
                        lowLevelCreep =
                            _.find(creeps, (creep) =>
                                (creep.memory as CreepMemory).techLevel < energyLevel);
                    }

                    if (lowLevelCreep) {
                        lowLevelCreep.say("Let me go...");
                        lowLevelCreep.suicide();
                    }
                }
            }

        } else {
            // tslint:disable-next-line:no-console
            console.log("Energy level is less than 0");
        }
    }

    public doEconomicStuffInRoom(room: Room) {
        const creeps = this.creepManager.getCreepsForRoom(room);

        const harvesters = this.creepManager.getHarvesters(creeps);
        const upgraders = this.creepManager.getUpgraders(creeps);
        const builders = this.creepManager.getBuilders(creeps);

        /**
         * let's harvest some energy:
         */
        this.harvesterRole.harvestEnergy(harvesters);

        /**
         * let's upgrade the controller:
         */
        this.upgraderRole.upgradeController(upgraders);

        this.builderRole.updateBuildingTasks(builders);
        this.builderRole.performBuildingTasks(builders);
    }

    public checkTechLevel(room: Room) {
        this.roomManager.updateRoomExtensions(room);
    }

}
