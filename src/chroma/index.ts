import formatText, { TextFormatOptions } from "./formatText";
import getFormatCodes from "./getFormatCodes";
import makeCallable from "./makeCallable";
import TextColor from "./textColor";

interface Chroma {
  /**
   * Wrap text in the formatting this Chroma instance represents.
   *
   * @param text The text to format; if multiple strings are provided they will be joined with spaces.
   * @returns A string of text with Minecraft formatting codes applied.
   */
  (...text: string[]): string;
}

class Chroma {
  private formatting: TextFormatOptions;

  constructor(formatting: TextFormatOptions = {}) {
    this.formatting = formatting;

    function format(this: Chroma, ...text: string[]) {
      return formatText(text.join(" "), this.formatting);
    }

    return makeCallable(this, format);
  }

  /**
   * Convert this Chroma instance into the formatting codes it represents.
   *
   * @returns A string of Minecraft formatting codes.
   *
   * @example
   * ```js
   * import chroma from "chroma";
   *
   * // Returns "§c§l"
   * chroma.red.bold.toString();
   *
   * // Returns "§oHello there"
   * chroma.italic + "Hello there";
   * ```
   */
  toString() {
    return getFormatCodes(this.formatting);
  }

  private with<O extends keyof TextFormatOptions>(
    option: O,
    value: TextFormatOptions[O]
  ) {
    return new Chroma({ ...this.formatting, [option]: value });
  }

  // Modifiers

  get bold() {
    return this.with("bold", true);
  }
  get italic() {
    return this.with("italic", true);
  }
  get obfuscated() {
    return this.with("obfuscated", true);
  }

  get reset() {
    return new Chroma({ reset: true });
  }

  // Colors

  color(textColor: TextColor) {
    return this.with("color", textColor);
  }

  get aqua() {
    return this.color(TextColor.Aqua);
  }
  get black() {
    return this.color(TextColor.Black);
  }
  get blue() {
    return this.color(TextColor.Blue);
  }
  get darkAqua() {
    return this.color(TextColor.DarkAqua);
  }
  get darkBlue() {
    return this.color(TextColor.DarkBlue);
  }
  get darkGray() {
    return this.color(TextColor.DarkGray);
  }
  get darkGreen() {
    return this.color(TextColor.DarkGreen);
  }
  get darkPurple() {
    return this.color(TextColor.DarkPurple);
  }
  get darkRed() {
    return this.color(TextColor.DarkRed);
  }
  get gold() {
    return this.color(TextColor.Gold);
  }
  get gray() {
    return this.color(TextColor.Gray);
  }
  get green() {
    return this.color(TextColor.Green);
  }
  get lightPurple() {
    return this.color(TextColor.LightPurple);
  }
  get materialAmethyst() {
    return this.color(TextColor.MaterialAmethyst);
  }
  get materialCopper() {
    return this.color(TextColor.MaterialCopper);
  }
  get materialDiamond() {
    return this.color(TextColor.MaterialDiamond);
  }
  get materialEmerald() {
    return this.color(TextColor.MaterialEmerald);
  }
  get materialGold() {
    return this.color(TextColor.MaterialGold);
  }
  get materialIron() {
    return this.color(TextColor.MaterialIron);
  }
  get materialLapis() {
    return this.color(TextColor.MaterialLapis);
  }
  get materialNetherite() {
    return this.color(TextColor.MaterialNetherite);
  }
  get materialQuartz() {
    return this.color(TextColor.MaterialQuartz);
  }
  get materialRedstone() {
    return this.color(TextColor.MaterialRedstone);
  }
  get minecoinGold() {
    return this.color(TextColor.MinecoinGold);
  }
  get red() {
    return this.color(TextColor.Red);
  }
  get yellow() {
    return this.color(TextColor.Yellow);
  }
  get white() {
    return this.color(TextColor.White);
  }
}

/**
 * Chroma provides a readable interface for Minecraft text formatting within scripting.
 *
 * @see https://minepicker.com/script-libraries/chroma
 *
 * @example
 * ```js
 * import { world } from "@minecraft/server";
 * import chroma from "chroma";
 *
 * // Displays "§c§lThis message is important!§r"
 * world.sendMessage(
 *   chroma.red.bold("This message is important!")
 * );
 *
 * // Displays "§aMix §oit§r up!"
 * world.sendMessage(
 *   chroma.green + `Mix ${chroma.italic("it")} up`
 * );
 *
 * // Displays "§5§oVery §lvery §bnestable§r"
 * world.sendMessage(
 *   chroma.blue.italic("Very " +
 *     chroma.bold("very " +
 *       chroma.aqua("nestable")
 *     )
 *   )
 * );
 * ```
 */
const chroma = new Chroma();

export default chroma;
export { chroma, TextColor };
