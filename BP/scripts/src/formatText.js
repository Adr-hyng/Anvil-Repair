import getFormatCodes from "./getFormatCodes";
import formatCodes from "./formatCodes";
const formattingEnd = `${formatCodes.reset}§¬`;
const nestedFormattingEnd = new RegExp(`(?<=${formattingEnd}(?!${formatCodes.reset}|$))`, "g");
export default function formatText(text, formatting) {
    const prefix = getFormatCodes(formatting);
    text = prefix + text;
    text = text.replace(nestedFormattingEnd, prefix);
    if (!text.endsWith(formattingEnd))
        text += formattingEnd;
    return text;
}
