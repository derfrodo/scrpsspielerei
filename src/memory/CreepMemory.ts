/**
 * Creep memory will be written to creep.memory
 */
// tslint:disable-next-line:interface-name
interface CreepMemory {
    /**
     * Role from Roles constants
     */
    role: string;

    /**
     * Tech level of creep
     */
    techLevel: number;
}
