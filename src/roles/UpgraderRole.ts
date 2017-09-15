import { inject, injectable } from "inversify";

import { DefaultCreepSettings } from "../constants/creepSettings";
import { Roles } from "../constants/roles";
import { TYPES } from "../constants/Types";

import { ICreepManager } from "../managers/Contract/ICreepManager";
import { IUpgraderRole } from "./Contract/IUpgraderRole";

@injectable()
export class UpgraderRole implements IUpgraderRole {

    private creepManager: ICreepManager;

    constructor( @inject(TYPES.CreepManager) creepManager: ICreepManager) {
        this.creepManager = creepManager;
    }

    public createUpgradersIfNeeded = (upgraderCreeps: Creep[]) => {

        const buildersBaseName = `${Roles.CREEP_UPGRADER_ROLE}_Udo_`;
        this.creepManager.createCreeps(upgraderCreeps,
            DefaultCreepSettings.buildersTargetCount,
            buildersBaseName,
            [CARRY, WORK, MOVE]);
    }

    public upgradeController(upgraderCreeps: Creep[]) {
        // tslint:disable-next-line:forin
        for (const creepIndex in upgraderCreeps) {
            const creep = upgraderCreeps[creepIndex];
            if (creep.memory.upgrading === false) {
                if (creep.carry.energy < creep.carryCapacity) {
                    const sources: Source = creep.pos.findClosestByPath(FIND_SOURCES) as Source;
                    if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources);
                    }
                } else {
                    creep.memory.upgrading = true;
                }
            } else {
                if (creep.carry.energy <= 0) {
                    creep.memory.upgrading = false;
                } else {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller.pos,
                            {
                                visualizePathStyle: {
                                    fill: "transparent",
                                    lineStyle: "dashed",
                                    opacity: .1,
                                    stroke: "#fff",
                                    strokeWidth: .15,
                                },
                            });
                    }
                }
            }
        }
    }

    public upgradeSpawn() {
        // const c: Creep;
    }
}
