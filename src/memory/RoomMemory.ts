import { PositionInRoom } from "./DataStructures/PositionInRoom";

// tslint:disable:interface-name

export interface RoomMemory {
    structureRoads: StructureRoads;
}

export interface Road {
    /**
     * true -> no points to be build
     */
    finished: boolean;

    positions: PositionInRoom[];

    /**
     * Positions which contains construction sites for the road.
     */
    unfinishedPositions: PositionInRoom[];
}

/**
 * Roads to a specific structure by "connected" structures
 */
export interface RoadsToStructure {
    [structureId: string]: Road[];
}

/**
 * All roads connected to the structure by structureIds
 */
export interface StructureRoads {
    [structureId: string]: RoadsToStructure;
}
