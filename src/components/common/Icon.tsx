import {Ionicons} from "@expo/vector-icons";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Props = {
    name: IconName;
    size?: number;
    color?: string;
};

export default function Icon({
                                 name,
                                 size = 20,
                                 color = "#000",
                             }: Props) {
    return (
        <Ionicons
            name={name}
            size={size}
            color={color}
        />
    );
}