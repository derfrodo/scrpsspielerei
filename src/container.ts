// reflect-metadata should be imported
// before any interface or other imports
// also it should be imported only once
// so that a singleton is created.
import "reflect-metadata";

// Der container:
import { Container } from "inversify";

import { TYPES } from "./constants/Types";

// Interfaces
import { ICreepManager } from "./managers/Contract/ICreepManager";

// Implementations
import { CreepManager } from "./managers/CreepManager";
import { BuilderRole } from "./roles/BuilderRole";
import { HarversterRole } from "./roles/HarvesterRole";

// Service Container
export const DependencyService = new Container();
DependencyService.bind<ICreepManager>(TYPES.CreepManager).to(CreepManager);
DependencyService.bind<HarversterRole>(TYPES.HarvesterRole).to(HarversterRole);
DependencyService.bind<BuilderRole>(TYPES.BuilderRole).to(BuilderRole);

export default DependencyService;
