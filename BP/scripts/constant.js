import { JsonDatabase } from "./utils/Database/con-database";
export const ADDON_NAMESPACE = "yn";
export const ADDON_NAME = "ANVIL_REPAIR";
export const ADDON_IDENTIFIER = `${ADDON_NAMESPACE}:anvrep`;
export const db = new JsonDatabase(ADDON_NAME);
export var AnvilDamageStates;
(function (AnvilDamageStates) {
    AnvilDamageStates["UNDAMAGED"] = "undamaged";
    AnvilDamageStates["USED"] = "slightly_damaged";
    AnvilDamageStates["BROKEN"] = "very_damaged";
})(AnvilDamageStates || (AnvilDamageStates = {}));
export var AnvilStateTypes;
(function (AnvilStateTypes) {
    AnvilStateTypes["DIRECTION"] = "direction";
    AnvilStateTypes["DAMAGE"] = "damage";
    AnvilStateTypes["CARDINAL_DIRECTION"] = "minecraft:cardinal_direction";
})(AnvilStateTypes || (AnvilStateTypes = {}));
