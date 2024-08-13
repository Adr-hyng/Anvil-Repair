import getFormatCodes from "./getFormatCodes";
import formatCodes from "./formatCodes";
import TextColor from "./textColor";

// Used to handle nested formatting
const formattingEnd = `${formatCodes.reset}§¬`;
const nestedFormattingEnd = new RegExp(`(?<=${formattingEnd}(?!${formatCodes.reset}|$))`, "g");

export interface TextFormatOptions {
  reset?: boolean;
  bold?: boolean;
  color?: TextColor;
  italic?: boolean;
  obfuscated?: boolean;
}

export default function formatText(text: string, formatting: TextFormatOptions) {
  const prefix = getFormatCodes(formatting);

  text = prefix + text;
  text = text.replace(nestedFormattingEnd, prefix);

  if (!text.endsWith(formattingEnd)) text += formattingEnd;

  return text;
}
