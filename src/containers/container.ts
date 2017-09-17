// reflect-metadata should be imported
// before any interface or other imports
// also it should be imported only once
// so that a singleton is created.
import "reflect-metadata";

// The container itself
import { Container } from "inversify";

import { BuilderRolesContainer } from "./builderRolesContainer";
import { GeneralContainer } from "./generalContainer";

// Service Container
export const DependencyService = Container.merge(GeneralContainer, BuilderRolesContainer);

export default DependencyService;
