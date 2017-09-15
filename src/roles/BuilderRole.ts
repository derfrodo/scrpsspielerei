import { inject, injectable } from "inversify";

import { DefaultCreepSettings } from "../constants/creepSettings";
import { Roles } from "../constants/roles";
import { CreepManager } from "../managers/CreepManager";
import { IBuilderRole } from "./Contract/IBuilderRole";

@injectable()
export class BuilderRole implements IBuilderRole {

    private creepManager: CreepManager = new CreepManager();

    public createBuildersIfNeeded = (builderCreeps: Creep[]) => {

        const buildersBaseName = `${Roles.CREEP_BUILDER_ROLE}_Bernd_`;
        this.creepManager.createCreeps(builderCreeps,
            DefaultCreepSettings.buildersTargetCount,
            buildersBaseName);
    }
}
