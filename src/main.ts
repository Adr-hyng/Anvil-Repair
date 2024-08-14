import { world, system, BlockPermutation, EntityInventoryComponent, WorldBeforeEvents, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithBlockBeforeEventSignal, World} from "@minecraft/server";

import { AnvilDamageStates, AnvilStateTypes } from "./constant";
import { MinecraftBlockTypes, MinecraftItemTypes } from "vanilla-types/index";
import configuration from "configuration/server_configuration";
export const itemInteractedLogMap: Map<string, number> = new Map();

// Localization was achieved using google translate, if there's grammar / spelling error, feel free to contribute.
world.afterEvents.playerSpawn.subscribe((e) => {
  if(!e.initialSpawn) return;
  if(!configuration.ShowMessageUponJoin) return;
  e.player.runCommandAsync(`tellraw ${e.player.name} {"rawtext":[{"translate":"yn.anvil_repair.on_load_message"}]}`);
});


world.beforeEvents.itemUseOn.subscribe((e) => {
  const blockInteracted = e.block;
  const heldItem = e.itemStack;
  const player = e.source;
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
    e.cancel = true;
    if(heldItem.amount > configuration.IronIngotsRequired) {
      heldItem.amount -= configuration.IronIngotsRequired;
      const deductedIronIngot = heldItem.clone();
      (player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container.setItem(player.selectedSlotIndex, deductedIronIngot);
    } else if (heldItem.amount < configuration.IronIngotsRequired) {
      player.runCommandAsync(`tellraw ${player.name} {"rawtext":[{"translate": "yn.anvil_repair.insufficient_message", "with": [ "${configuration.IronIngotsRequired - heldItem.amount}" ]}]}`);
      return;
    } else if (heldItem.amount === configuration.IronIngotsRequired) {
      (player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container.setItem(player.selectedSlotIndex, undefined);
    }
    blockInteracted.setPermutation(prevAnvilState);
    player.playSound('random.anvil_use');
  });
});