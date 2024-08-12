import { world, system, Player, PlayerLeaveAfterEvent, ScriptEventCommandMessageAfterEvent, ScriptEventSource} from "@minecraft/server";

import { ADDON_IDENTIFIER } from "./constant";

const playerBeingShown: Map<string, boolean> = new Map<string, boolean>();

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
        player.sendMessage(`§cInvalid Command ${cmd}\nCheck If The Command Actually Exists. Use /scriptevent yn:immersif help`);
      } else {
        console.error(err);
      }
    }
  });
});

world.afterEvents.playerLeave.subscribe( (event: PlayerLeaveAfterEvent) => {
  delete playerBeingShown[event.playerId];
});