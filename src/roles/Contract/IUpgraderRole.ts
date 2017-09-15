export interface IUpgraderRole {
    createUpgradersIfNeeded(upgraderCreeps: Creep[]): void;
    upgradeController(upgraderCreeps: Creep[]): void;
}
