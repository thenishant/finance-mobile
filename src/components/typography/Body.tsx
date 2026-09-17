import {typography} from "../../design";
import {createText} from "./createTypography";

export const Body = createText(
    typography.body.fontSize,
    typography.body.lineHeight,
);