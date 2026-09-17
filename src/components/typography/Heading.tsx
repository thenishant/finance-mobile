import {typography} from "../../design";
import {createText} from "./createTypography";

export const Heading = createText(
    typography.heading.fontSize,
    typography.heading.lineHeight,
    "regular",
);