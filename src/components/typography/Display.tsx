import {typography} from "../../design";
import {createText} from "./createTypography";

export const Display = createText(
    typography.display.fontSize,
    typography.display.lineHeight,
    "bold",
);