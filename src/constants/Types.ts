// tslint:disable object-literal-sort-keys
export const TYPES = {
    // Controllers:
    RoomController: Symbol("RoomController"),
    RoadController: Symbol("RoadController"),

    // Managers:
    CreepManager: Symbol("CreepManager"),
    RoomManager: Symbol("RoomManager"),

    // Roles:
    HarvesterRole: Symbol("HarvesterRole"),
    UpgraderRole: Symbol("UpgraderRole"),
    BuilderRole: Symbol("BuilderRole"),

    BuilderRoles: {
        RoadBuilderRole: Symbol("RoadBuilderRole"),
    },

    // Settings:
    CreepSettings: Symbol("CreepSettings"),
    RoomSettings: Symbol("RoomSettings"),
};

export default TYPES;
