export interface IHarversterRole {
    harvestEnergy(harvestingCreeps: Creep[]): void;
    createHarvestersIfNeeded(harvestingCreeps: Creep[]): void;
}
