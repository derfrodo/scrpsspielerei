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

type HarvesterStatus = "BringBack" | "Harvesting" | "Building" | undefined;

export interface BuilderCreepMemory extends CreepMemory {
    initializing: boolean;

    building: boolean;

    /**
     * What type of builder is that... ?
     */
    buildingType: BuildingType;
}

/**
 * Memory for a road building creep...
 */
export interface RoadBuilderCreepMemory extends BuilderCreepMemory {
    currentRoadBuilderTask: RoadBuilderTask;

    /**
     * Where has this creep stopped building a road towards the destination
     */
    lastConstructionSitePosition: WayPoint;

    /**
     * From where shall road building be started?
     */
    roadBuildingStart: WayPoint;

    /**
     * Where are we heading to while building our road?
     */
    roadBuildingDestination: WayPoint;

    roadBuldingStartType: StructureType;

    roadBuildingDestinationType: StructureType;
}

export interface WayPoint { x: number; y: number; roomName?: string; }

export type RoadBuilderTask = "Initializing" | "Harvesting" | "GotoStart" | "Building";

export type StructureType = "controller" | "spawn" | "energy";

export type BuildingType = "RoadBuilder" | "Unspecified";
