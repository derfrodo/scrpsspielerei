export interface IRoomManager {
    /**
     * Create creeps for all my rooms
     */
    createCreepsForMyRooms(): void;

    /**
     * Create creeps for a specific room
     */
    createCreepsForRoom(room: Room): void;
}
