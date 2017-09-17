export interface IRoomManager {

    /**
     * returns the energy level (0-2) according to our defined tech level
     * may be extended in the future
     */
    getRoomEnergyLevel(room: Room): number;

    getSpawnsInRoom(room: Room): StructureSpawn[];
    getAvailableSpawnsInRoom(room: Room, creepParts: string[]): StructureSpawn[];

    getStructuresInRoom(room: Room, additionalFilter?: (strct: Structure) => boolean): Structure[];
    getExtensionsInRoom(room: Room): StructureExtension[];

    /**
     * Returns a construction site for an extension of the room (first or default... may return null or undefined)
     */
    getExtensionConstructionSiteOfRoom(room: Room): ConstructionSite;

    /**
     * resolves all construction sites inside the given room
     */
    getConstructionSitesInRoom(room: Room): ConstructionSite[];

    /**
     * create a creep flagged as harvester inside the room according to energy/tech level
     */
    createHarvesterInRoom(energyLevel: number, room: Room);
    createUpgraderInRoom(energyLevel: number, room: Room);
    createBuilderInRoom(energyLevel: number, room: Room);

    /**
     * Sets construction sites according to the level of the room's controller
     */
    updateRoomExtensions(room: Room);
}
