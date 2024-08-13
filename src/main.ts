import { world, system, Player, PlayerLeaveAfterEvent, ScriptEventCommandMessageAfterEvent, ScriptEventSource, BlockPermutation, EntityInventoryComponent, Block} from "@minecraft/server";

import { ADDON_IDENTIFIER, AnvilDamageStates, AnvilStateTypes, db } from "./constant";
import { MinecraftBlockTypes, MinecraftItemTypes } from "vanilla-types/index";
import { Logger } from "utils/logger";

const playerBeingShown: Map<string, boolean> = new Map<string, boolean>();
export const itemInteractedLogMap: Map<string, number> = new Map();

import('@minecraft/server-ui').then((ui) => {
  var [userBusy, userClosed] = Object.values(ui.FormCancelationReason), formData;
  for (formData of [ui.ActionFormData, ui.MessageFormData, ui.ModalFormData]) {
    const formShow = Object.getOwnPropertyDescriptor(formData.prototype, "show").value;
    Object.defineProperty(formData.prototype, "show", {
      value: function (player, persistent = false, trials = 10) {
        const show = formShow.bind(this,player);
        if (player.id in playerBeingShown) return;
        playerBeingShown[player.id] = true;
        return new Promise(async (resolve) => {
          let result;
          do {
            result = await show();
            if (!trials-- || persistent && result.cancelationReason === userClosed) return delete playerBeingShown[player.id];
          } while (result.cancelationReason === userBusy);
          delete playerBeingShown[player.id];
          resolve(result);
        })
      }
    })
  };
});

world.beforeEvents.playerInteractWithBlock.subscribe((e) => {
  const blockInteracted = e.block;
  const heldItem = e.itemStack;
  const player = e.player;
  if(!heldItem) return;
  if(!heldItem.matches(MinecraftItemTypes.IronIngot)) return;
  if(!blockInteracted.matches(MinecraftBlockTypes.Anvil)) return;
  if(!player.isSneaking) return;
  const anvilDamageStage = blockInteracted.permutation.getState(AnvilStateTypes.DAMAGE) as string;
  const PreviousAnvilDamageMapper: Map<string, BlockPermutation> = new Map([
    [AnvilDamageStates.USED, blockInteracted.permutation.withState(AnvilStateTypes.DAMAGE, AnvilDamageStates.UNDAMAGED)],
    [AnvilDamageStates.BROKEN, blockInteracted.permutation.withState(AnvilStateTypes.DAMAGE, AnvilDamageStates.USED)],
  ]);
  const prevAnvilState: BlockPermutation = PreviousAnvilDamageMapper.get(anvilDamageStage);
  if(!prevAnvilState) return;
  system.run(() => {
    const oldLog = itemInteractedLogMap.get(player.id) as number;
    itemInteractedLogMap.set(player.id, Date.now());
    if ((oldLog + 150) >= Date.now()) return;
    
    blockInteracted.setPermutation(prevAnvilState);
    e.cancel = true;
    if(heldItem.amount > 1) {
      player.playSound('random.anvil_use');
      heldItem.amount -= 1;
      const deductedIronIngot = heldItem.clone();
      player.getComponent(EntityInventoryComponent.componentId).container.setItem(player.selectedSlotIndex, deductedIronIngot);
    } else {
      player.playSound('random.break');
      player.getComponent(EntityInventoryComponent.componentId).container.setItem(player.selectedSlotIndex, undefined);
    }
  });
});

/**
 * TODO
 * - configuration:
 *  help
 *  config show
 *  database show/reset
 * 
 *  Configuration Screen:
 *  number of iron ingot to repair
 *  show repair animation
 */

system.afterEvents.scriptEventReceive.subscribe((event: ScriptEventCommandMessageAfterEvent) => {
  if(event.sourceType !== ScriptEventSource.Entity) return;
  if(!(event.sourceEntity instanceof Player)) return;
  if(event.id !== ADDON_IDENTIFIER) return;
  const player = event.sourceEntity as Player;
  const message = event.message;
  const args = message.trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  system.run(async () => {
    try {
        const {
          default: CommandObject
        } = await import(`./commands/${cmd}.js`);
        CommandObject.execute(player, args);
    } catch (err) {
      if (err instanceof ReferenceError) {
        player.sendMessage(`§cInvalid Command ${cmd}\nCheck If The Command Actually Exists. Use /scriptevent ${ADDON_IDENTIFIER} help`);
      } else {
        console.error(err);
      }
    }
  });
});

world.afterEvents.playerLeave.subscribe( (event: PlayerLeaveAfterEvent) => {
  delete playerBeingShown[event.playerId];
});