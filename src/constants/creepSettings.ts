export class CreepSettings {

    /**
     * How many harvesters shall be created inside a single room?
     */
    public harvestersPerRoom = 5;

    /**
     * How many upgraders shall be created inside a single room?
     */
    public upgradersPerRoom = 2;
}

export const DefaultCreepSettings = new CreepSettings();
