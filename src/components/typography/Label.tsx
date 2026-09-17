import {typography} from "../../design";
import {createText} from "./createTypography";

export const Label = createText(
    typography.label.fontSize,
    typography.label.lineHeight,
    "medium",
);