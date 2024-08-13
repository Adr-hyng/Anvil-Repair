import { world, system, BlockPermutation, EntityInventoryComponent} from "@minecraft/server";

import { chroma } from "chroma/index";
import { AnvilDamageStates, AnvilStateTypes } from "./constant";
import { MinecraftBlockTypes, MinecraftItemTypes } from "vanilla-types/index";
import configuration from "configuration/server_configuration";
export const itemInteractedLogMap: Map<string, number> = new Map();

world.afterEvents.worldInitialize.subscribe((e) => {
  world.sendMessage(chroma.green(`${chroma.bold("Anvil Repair Addon")} has been loaded successfully by Adr-hyng.`));
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
    if(heldItem.amount > configuration.IronIngotsRequired) {
      player.playSound('random.anvil_use');
      heldItem.amount -= configuration.IronIngotsRequired;
      const deductedIronIngot = heldItem.clone();
      player.getComponent(EntityInventoryComponent.componentId).container.setItem(player.selectedSlotIndex, deductedIronIngot);
    } else {
      player.playSound('random.break');
      player.getComponent(EntityInventoryComponent.componentId).container.setItem(player.selectedSlotIndex, undefined);
    }
  });
});