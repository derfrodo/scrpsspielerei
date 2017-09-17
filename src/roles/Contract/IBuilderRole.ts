export interface IBuilderRole {
    /**
     * Updates the builder types
     */
    updateBuilderTypes(room: Room, buildingCreeps: Creep[]): void;

    performBuildingTasks(buildingCreeps: Creep[]): void;
}
