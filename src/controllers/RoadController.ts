// tslint:disable:no-console
// tslint:disable:forin

import { inject, injectable } from "inversify";
import { TYPES } from "../constants/Types";

import { RoomSettings } from "../constants/roomSettings";

import { IRoomManager } from "../managers/Contract/IRoomManager";
import { Road } from "../memory/RoomMemory";

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
            this.planRoadsForRoom(room);
        }
    }

    private planRoadsForRoom(room: Room) {
        // we want some roads between our structures.
        const rm = this.roomManager.getRoomMemory(room);
        if (!rm.roads) {
            rm.roads = { activeRoad: null, roadsInfos: {} };
        }

        const roads = rm.roads;

        // check if active road is still active:
        if (roads.activeRoad) {
            const r = roads.activeRoad;

            _.remove(r.unfinishedPositions, (pos) => {
                const lats = room.lookAt(pos.x, pos.y);
                const cs = _.find(lats, (lat) => lat.type === LOOK_CONSTRUCTION_SITES);
                return !cs;
            });

            if (r.unfinishedPositions.length === 0) {
                r.finished = true;
            }
        }

        if (!roads.activeRoad || roads.activeRoad.finished) {
            // Plan the next road!
            // Well we need to select a star point, don't we?
            // console.log("We need a new road in room " + room.name);

            let selectedRoad: {
                start?: { pos: RoomPosition; id: string; },
                destination?: { pos: RoomPosition; id: string; },
                count?: number,
            };

            // Sources to ...
            const sources = room.find(FIND_SOURCES) as Source[];
            for (const i in sources) {
                const source = sources[i];
                if (!roads.roadsInfos[source.id]) {
                    roads.roadsInfos[source.id] = {};
                }

                const infos = roads.roadsInfos[source.id];

                // Spawns
                const spawns = room.find(FIND_MY_SPAWNS) as Spawn[];
                for (const j in spawns) {
                    const spawn = spawns[j];
                    const info = infos[spawn.id];
                    if ((info || 0) >= this.roomSettings.maximumRoadsBetweenStructure) {
                        continue;
                    } else if (!selectedRoad || selectedRoad.count > (info || 0)) {
                        selectedRoad = {
                            count: info || 0,
                            destination: spawn,
                            start: source,
                        };
                    }
                }

                // Extensions
                const extensions = room.find(FIND_STRUCTURES,
                    {
                        filter: (struct) =>
                            (struct as Structure).structureType === STRUCTURE_EXTENSION,
                    }) as StructureExtension[];

                for (const j in extensions) {
                    const extension = extensions[j];
                    const info = infos[extension.id];
                    if ((info || 0) >= this.roomSettings.maximumRoadsBetweenStructure) {
                        continue;
                    } else if (!selectedRoad || selectedRoad.count > (info || 0)) {
                        selectedRoad = {
                            count: info || 0,
                            destination: extension,
                            start: source,
                        };
                    }
                }

                // Controller
                {
                    const info = infos[room.controller.id];
                    if ((info || 0) >= this.roomSettings.maximumRoadsBetweenStructure) {
                        // controller has already enough roads.
                    } else if (!selectedRoad || selectedRoad.count > (info || 0)) {
                        selectedRoad = {
                            count: info || 0,
                            destination: room.controller,
                            start: source,
                        };
                    }
                }
            }

            if (selectedRoad) {
                console.log("Creating construction sites for new road in room " + room.name);
                const nextRoad = this.buildRoad(room, selectedRoad.start.pos, selectedRoad.destination.pos);
                roads.activeRoad = nextRoad;
                roads.roadsInfos[selectedRoad.start.id][selectedRoad.destination.id] = selectedRoad.count + 1;
            }
        }
    }

    private buildRoad(room: Room, pos1: RoomPosition, pos2: RoomPosition): Road {
        const newRoad: Road = {
            finished: false,
            positions: [],
            unfinishedPositions: [],
        };

        const callback = (roomName: string, costMatrix: CostMatrix) => {
            const clone = costMatrix.clone();
            const css = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES) as ConstructionSite[];
            for (const cs of css) {
                clone.set(cs.pos.x, cs.pos.y, 6);
                // console.log(cs.pos.x + " " + cs.pos.y);
            }

            const rds = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (str: Structure) => str.structureType === STRUCTURE_ROAD,
            }) as Structure[];
            for (const rd of rds) {
                clone.set(rd.pos.x, rd.pos.y, 6);
                // console.log(rd.pos.x + " " + rd.pos.y);
            }

            // for (let i = 0; i < 50; i++) {
            //     let row: string = "";
            //     for (let j = 0; j < 50; j++) {
            //         row += clone.get(j, i) + " ";
            //     }
            //     console.log(row);
            // }

            return clone;
        };

        const path = pos1.findPathTo(pos2, { ignoreCreeps: true, ignoreRoads: true, costCallback: callback });

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
