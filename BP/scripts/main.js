import { world, system, Player, ScriptEventSource, EntityInventoryComponent } from "@minecraft/server";
import { ADDON_IDENTIFIER, AnvilDamageStates, AnvilStateTypes } from "./constant";
import { MinecraftBlockTypes, MinecraftItemTypes } from "vanilla-types/index";
const playerBeingShown = new Map();
export const itemInteractedLogMap = new Map();
import('@minecraft/server-ui').then((ui) => {
    var [userBusy, userClosed] = Object.values(ui.FormCancelationReason), formData;
    for (formData of [ui.ActionFormData, ui.MessageFormData, ui.ModalFormData]) {
        const formShow = Object.getOwnPropertyDescriptor(formData.prototype, "show").value;
        Object.defineProperty(formData.prototype, "show", {
            value: function (player, persistent = false, trials = 10) {
                const show = formShow.bind(this, player);
                if (player.id in playerBeingShown)
                    return;
                playerBeingShown[player.id] = true;
                return new Promise(async (resolve) => {
                    let result;
                    do {
                        result = await show();
                        if (!trials-- || persistent && result.cancelationReason === userClosed)
                            return delete playerBeingShown[player.id];
                    } while (result.cancelationReason === userBusy);
                    delete playerBeingShown[player.id];
                    resolve(result);
                });
            }
        });
    }
    ;
});
world.beforeEvents.playerInteractWithBlock.subscribe((e) => {
    const blockInteracted = e.block;
    const heldItem = e.itemStack;
    const player = e.player;
    if (!heldItem)
        return;
    if (!heldItem.matches(MinecraftItemTypes.IronIngot))
        return;
    if (!blockInteracted.matches(MinecraftBlockTypes.Anvil))
        return;
    if (!player.isSneaking)
        return;
    const anvilDamageStage = blockInteracted.permutation.getState(AnvilStateTypes.DAMAGE);
    const PreviousAnvilDamageMapper = new Map([
        [AnvilDamageStates.USED, blockInteracted.permutation.withState(AnvilStateTypes.DAMAGE, AnvilDamageStates.UNDAMAGED)],
        [AnvilDamageStates.BROKEN, blockInteracted.permutation.withState(AnvilStateTypes.DAMAGE, AnvilDamageStates.USED)],
    ]);
    const prevAnvilState = PreviousAnvilDamageMapper.get(anvilDamageStage);
    if (!prevAnvilState)
        return;
    system.run(() => {
        const oldLog = itemInteractedLogMap.get(player.id);
        itemInteractedLogMap.set(player.id, Date.now());
        if ((oldLog + 150) >= Date.now())
            return;
        blockInteracted.setPermutation(prevAnvilState);
        e.cancel = true;
        if (heldItem.amount > 1) {
            player.playSound('random.anvil_use');
            heldItem.amount -= 1;
            const deductedIronIngot = heldItem.clone();
            player.getComponent(EntityInventoryComponent.componentId).container.setItem(player.selectedSlotIndex, deductedIronIngot);
        }
        else {
            player.playSound('random.break');
            player.getComponent(EntityInventoryComponent.componentId).container.setItem(player.selectedSlotIndex, undefined);
        }
    });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.sourceType !== ScriptEventSource.Entity)
        return;
    if (!(event.sourceEntity instanceof Player))
        return;
    if (event.id !== ADDON_IDENTIFIER)
        return;
    const player = event.sourceEntity;
    const message = event.message;
    const args = message.trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    system.run(async () => {
        try {
            const { default: CommandObject } = await import(`./commands/${cmd}.js`);
            CommandObject.execute(player, args);
        }
        catch (err) {
            if (err instanceof ReferenceError) {
                player.sendMessage(`§cInvalid Command ${cmd}\nCheck If The Command Actually Exists. Use /scriptevent ${ADDON_IDENTIFIER} help`);
            }
            else {
                console.error(err);
            }
        }
    });
});
world.afterEvents.playerLeave.subscribe((event) => {
    delete playerBeingShown[event.playerId];
});
