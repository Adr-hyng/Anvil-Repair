import { CommandHandler } from "commands/command_handler";
import { Vector3, world } from "@minecraft/server";
import { ICommandBase } from "./ICommandBase";
import { db } from "constant";
import { Logger } from "utils/logger";

// Automate this, the values should be the description.
enum REQUIRED_PARAMETER {
    TEST = "test",
}

const command: ICommandBase = {
    name: 'dev_helper',
    description: 'Developer Utility Command',
    format: `[${Object.values(REQUIRED_PARAMETER).join('|')}]`,
    usage() {
        return (`
        Format:
        > ${CommandHandler.prefix}${this.name} ${this.format}
        Usage:
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.TEST} = TEST a Working-in-progress features.
        `).replaceAll("        ", "");
    },
    execute(player, args) {
        if (!(args && args.length)) return;
        const requiredParams: string[] = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim()); 
        const selectedReqParam: string = args[0].toLowerCase();
        if(!requiredParams.includes(selectedReqParam)) return player.sendMessage("§cInvalid Usage Format." + command.usage());
        if(!player.isOp()) return;
        switch(selectedReqParam) {
            case REQUIRED_PARAMETER.TEST:
                if(!player.isOp()) break;
                world.sendMessage("HELLO WORLD!");
                break;
            default:
                break;
        }
    }
};

export default command