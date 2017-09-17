// tslint:disable:interface-name

/**
 * Creep memory will be written to creep.memory
 */
export interface CreepMemory {
    /**
     * Role from Roles constants
     */
    role: string;

    /**
     * Tech level of creep
     */
    techLevel: number;
}

export interface HarvesterCreepMemory extends CreepMemory {
    status: HarvesterStatus;
}

export interface BuilderCreepMemory extends CreepMemory {

    status: BuilderStatus;
}

type HarvesterStatus = "BringBack" | "Harvesting" | "Building" | undefined;

export type BuilderStatus = "Harvesting" | "Building";
