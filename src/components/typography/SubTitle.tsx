import {typography} from "../../design";
import {createText} from "./createTypography";

export const SubTitle = createText(
    typography.subtitle.fontSize,
    typography.subtitle.lineHeight,
    "medium",
);