// The container itself
import { Container } from "inversify";

import { TYPES } from "../constants/Types";

// Interfaces
import { BuilderRole } from "../roles/BuilderRole";
import { IBuilderRole } from "../roles/Contract/IBuilderRole";

import { IRoadBuilderRole, RoadBuilderRole } from "../roles/BuilderRoles/RoadBuilderRole";

// Service Container
export const BuilderRolesContainer = new Container();

BuilderRolesContainer.bind<IBuilderRole>(TYPES.BuilderRole).to(BuilderRole);

BuilderRolesContainer.bind<IRoadBuilderRole>(TYPES.BuilderRoles.RoadBuilderRole).to(RoadBuilderRole);

export default BuilderRolesContainer;
