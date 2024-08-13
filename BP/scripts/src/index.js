import formatText from "./formatText";
import getFormatCodes from "./getFormatCodes";
import makeCallable from "./makeCallable";
import TextColor from "./textColor";
class Chroma {
    constructor(formatting = {}) {
        this.formatting = formatting;
        function format(...text) {
            return formatText(text.join(" "), this.formatting);
        }
        return makeCallable(this, format);
    }
    toString() {
        return getFormatCodes(this.formatting);
    }
    with(option, value) {
        return new Chroma({ ...this.formatting, [option]: value });
    }
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
    color(textColor) {
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
const chroma = new Chroma();
export default chroma;
export { chroma, TextColor };
