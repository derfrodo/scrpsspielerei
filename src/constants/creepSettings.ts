export class CreepSettings {

    /**
     * How many harvesters shall be created inside a single room?
     */
    public harvestersPerRoom = 3;

    /**
     * How many upgraders shall be created inside a single room?
     */
    public upgradersPerRoom = 4;

    public buildersPerRoom = 4;
}

export const DefaultCreepSettings = new CreepSettings();
