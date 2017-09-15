// tslint:disable-next-line:max-classes-per-file
export class MyCreeps {

    /**
     * Creeps for harvesting energy for spawns
     */
    public readonly creepsByRoles: CreepMap = {};

}

// tslint:disable-next-line:interface-over-type-literal
type CreepMap = { [roleName: string]: Creep[] };
