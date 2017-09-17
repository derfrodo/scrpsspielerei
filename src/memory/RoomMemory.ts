import { PositionInRoom } from "./DataStructures/PositionInRoom";

// tslint:disable:interface-name

export interface RoomMemory {
    roads: RoomRoadsMemory;
}

export interface RoomRoadsMemory {
    activeRoad: Road;

    roadsInfos: { [startId: string]: RoadsCount };
}

/**
 * Target of a road with numbers how many roads are leading towards the target
 */
export interface RoadsCount { [targetId: string]: number; }

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
