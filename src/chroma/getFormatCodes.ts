import { TextFormatOptions } from "./formatText";
import formatCodes from "./formatCodes";

export default function getFormatCodes(formatting: TextFormatOptions) {
  let codes = "";

  const { color, bold, italic, obfuscated, reset } = formatting;

  if (reset) codes += formatCodes.reset;

  if (bold) codes += formatCodes.bold;
  if (italic) codes += formatCodes.italic;
  if (obfuscated) codes += formatCodes.obfuscated;

  if (color) codes += formatCodes[color];

  return codes;
}
