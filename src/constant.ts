import { JsonDatabase } from "./utils/Database/con-database";
import { SERVER_CONFIGURATION } from "configuration/config_handler"

export const ADDON_NAMESPACE: string = "yn"
export const ADDON_NAME: string = "ANVIL_REPAIR";
export const ADDON_IDENTIFIER: string = `${ADDON_NAMESPACE}:anvrep`;
export const db = new JsonDatabase(ADDON_NAME);
