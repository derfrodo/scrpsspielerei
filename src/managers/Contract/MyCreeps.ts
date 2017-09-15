// tslint:disable-next-line:max-classes-per-file
export class MyCreeps {

    /**
     * Creeps for harvesting energy for spawns
     */
    public readonly roles: CreepMap = {};

    public addCreep(name: string, creep: Creep) {
        const parts = name.split("_");

        if (parts && parts.length > 0) {
            const creeps = this.getOrCreateCreepArrayByRole(parts[0]);
            creeps.push(creep);
        }
    }

    public getOrCreateCreepArrayByRole(roleName: string) {
        let creeps: Creep[] = this.roles[roleName];

        if (!creeps) {
            creeps = [];
            this.roles[roleName] = creeps;
        }

        return creeps;
    }

}

// tslint:disable-next-line:interface-over-type-literal
type CreepMap = { [roleName: string]: Creep[] };
