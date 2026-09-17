import {typography} from "../../design";
import {createText} from "./createTypography";

export const Caption = createText(
    typography.caption.fontSize,
    typography.caption.lineHeight,
);