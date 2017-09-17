// The container itself
import { Container } from "inversify";

import { TYPES } from "../constants/Types";

// Implementations
import { BuilderRole } from "../roles/BuilderRole";
import { HarversterRole } from "../roles/HarvesterRole";
import { UpgraderRole } from "../roles/UpgraderRole";

// Interfaces
import { IBuilderRole } from "../roles/Contract/IBuilderRole";
import { IHarvesterRole } from "../roles/Contract/IHarvesterRole";
import { IUpgraderRole } from "../roles/Contract/IUpgraderRole";

// Service Container
export const RoleContainer = new Container();

// Roles
RoleContainer.bind<IHarvesterRole>(TYPES.HarvesterRole).to(HarversterRole);
RoleContainer.bind<IUpgraderRole>(TYPES.UpgraderRole).to(UpgraderRole);
RoleContainer.bind<IBuilderRole>(TYPES.BuilderRole).to(BuilderRole);

export default RoleContainer;
