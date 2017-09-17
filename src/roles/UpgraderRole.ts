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

    public upgradeController(upgraderCreeps: Creep[]) {
        // tslint:disable-next-line:forin
        for (const creepIndex in upgraderCreeps) {
            const creep = upgraderCreeps[creepIndex];
            if (creep.memory.upgrading === false) {
                if (creep.carry.energy < creep.carryCapacity) {
                    const sources: Source = creep.pos.findClosestByPath(FIND_SOURCES) as Source;
                    if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources, UpgraderMoveToOptions);
                    }
                } else {
                    creep.memory.upgrading = true;
                }
            } else {
                if (creep.carry.energy <= 0) {
                    creep.memory.upgrading = false;
                } else {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller.pos, UpgraderMoveToOptions);
                    }
                }
            }
        }
    }

    public upgradeSpawn() {
        // const c: Creep;
    }
}

const UpgraderMoveToOptions: MoveToOpts = {
    visualizePathStyle: {
        fill: "transparent",
        lineStyle: "dashed",
        opacity: .1,
        stroke: "#ffff00",
        strokeWidth: .12,
    },
};
