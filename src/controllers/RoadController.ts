// tslint:disable:forin

import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { RoomSettings } from "../constants/roomSettings";

import { IRoomManager } from "../managers/Contract/IRoomManager";
import { Road, RoadsToStructure } from "../memory/RoomMemory";

import { PositionInRoom } from "../memory/DataStructures/PositionInRoom";

export interface IRoadController {
    updateRoadsForMyRooms();
}

@injectable()
export class RoadController implements IRoadController {

    private roomManager: IRoomManager;
    private roomSettings: RoomSettings;

    constructor(
        @inject(TYPES.RoomSettings) roomSettings: RoomSettings,
        @inject(TYPES.RoomManager) roomManager: IRoomManager) {

        this.roomSettings = roomSettings;
        this.roomManager = roomManager;
    }

    public updateRoadsForMyRooms() {
        const rooms = Game.rooms;

        for (const roomName in rooms) {
            const room = rooms[roomName];
            this.updateRoadsForRoom(room);
        }
    }

    public updateRoadsForRoom(room: Room) {
        const rm = this.roomManager.getRoomMemory(room);

        const structureRoads = rm.structureRoads || {};
        rm.structureRoads = structureRoads;

        for (const sr in structureRoads) {
            const rsts: RoadsToStructure = structureRoads[sr];
            for (const id in rsts) {
                const roads = rsts[id];
                const unfinishedRoads = _.filter(roads, (road) => !road.finished);

                for (const urIndex in unfinishedRoads) {
                    const uf = unfinishedRoads[urIndex];

                    _.remove(uf.unfinishedPositions, (pos) => {
                        const lats = room.lookAt(pos.x, pos.y);
                        const cs = _.find(lats, (lat) => lat.type === LOOK_CONSTRUCTION_SITES);
                        return !cs;
                    });

                    if (uf.unfinishedPositions.length === 0) {
                        uf.finished = true;
                    }
                }
            }
        }

        const srcs = room.find(FIND_SOURCES) as Source[];

        for (const srcName in srcs) {
            const source = srcs[srcName];
            const roadsToSource = rm.structureRoads[source.id] || {};
            rm.structureRoads[source.id] = roadsToSource;

            // Spawns ...
            const spawns = this.roomManager.getSpawnsInRoom(room);
            for (const spawn of spawns) {
                this.addRoadIfNeeded(room, source.pos, spawn.id, roadsToSource);
            }

            // Controller
            const ctrlr = room.controller;
            this.addRoadIfNeeded(room, source.pos, ctrlr.id, roadsToSource);

            // Extensions
            const extensions = this.roomManager.getExtensionsInRoom(room);
            for (const extension of extensions) {
                this.addRoadIfNeeded(room, source.pos, extension.id, roadsToSource);
            }
        }
    }

    private addRoadIfNeeded(room: Room, pos1, structureId: string, roadsToSource: RoadsToStructure) {
        const roadsFromStruct = roadsToSource[structureId] || [];
        roadsToSource[structureId] = roadsFromStruct;
        const unfinishedRoad = _.find(roadsFromStruct, (road) => !road.finished);
        if (!unfinishedRoad && roadsToSource[structureId].length < this.roomSettings.maximumRoadsBetweenStructure) {
            // we need a new road.
            const structure = Game.structures[structureId];
            const road = this.buildRoad(room, pos1, structure.pos);
            if (road.unfinishedPositions.length > 0) {
                roadsToSource[structureId].push(road);
            }
        }
    }

    private buildRoad(room: Room, pos1: RoomPosition, pos2: RoomPosition): Road {
        const newRoad: Road = {
            finished: false,
            positions: [],
            unfinishedPositions: [],
        };

        const roomsConstructuinSites = this.roomManager.getConstructionSitesInRoom(room) as RoomObject[];
        const roads =
            this.roomManager.getStructuresInRoom(room, (s) => s.structureType === STRUCTURE_ROAD) as RoomObject[];

        const callback = (roomName: string, costMatrix: CostMatrix) => {
            const clone = costMatrix.clone();
            for (const cs of roomsConstructuinSites) {
                clone.set(cs.pos.x, cs.pos.y, 254);
            }
            for (const rd of roads) {
                clone.set(rd.pos.x, rd.pos.y, 254);
            }
            return clone;
        };

        const path = pos1.findPathTo(pos2, { ignoreRoads: true, costCallback: callback });

        for (const stepIndex in path) {
            const step = path[stepIndex];
            const lats = room.lookAt(step.x, step.y);

            const position: PositionInRoom = {
                x: step.x,
                y: step.y,
            };

            newRoad.positions.push(position);
            // is there a road already?
            const existingStructureOrConstructionSite =
                _.find(lats, (lat) => lat.type === LOOK_STRUCTURES || lat.type === LOOK_STRUCTURES);
            if (!existingStructureOrConstructionSite) {
                room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                newRoad.unfinishedPositions.push(position);
            }
        }

        return newRoad;
    }
}
