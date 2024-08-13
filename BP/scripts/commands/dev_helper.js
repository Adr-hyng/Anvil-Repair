import { CommandHandler } from "commands/command_handler";
import { world } from "@minecraft/server";
var REQUIRED_PARAMETER;
(function (REQUIRED_PARAMETER) {
    REQUIRED_PARAMETER["TEST"] = "test";
})(REQUIRED_PARAMETER || (REQUIRED_PARAMETER = {}));
const command = {
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
        if (!(args && args.length))
            return;
        const requiredParams = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim());
        const selectedReqParam = args[0].toLowerCase();
        if (!requiredParams.includes(selectedReqParam))
            return player.sendMessage("§cInvalid Usage Format." + command.usage());
        if (!player.isOp())
            return;
        switch (selectedReqParam) {
            case REQUIRED_PARAMETER.TEST:
                if (!player.isOp())
                    break;
                world.sendMessage("HELLO WORLD!");
                break;
            default:
                break;
        }
    }
};
export default command;
