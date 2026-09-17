import {typography} from "../../design";
import {createText} from "./createTypography";

export const Title = createText(
    typography.title.fontSize,
    typography.title.lineHeight,
    "semibold",
);