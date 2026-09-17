import React from "react";
import {Dimensions, View,} from "react-native";

import Svg, {Defs, LinearGradient, Path, Stop,} from "react-native-svg";

interface HeroChartProps {
    data: number[];
}

const WIDTH = Dimensions.get("window").width - 80;
const HEIGHT = 140;

export default function HeroChart({
                                      data,
                                  }: HeroChartProps) {

    if (data.length < 2) {
        return <View/>;
    }

    const max = Math.max(...data);
    const min = Math.min(...data);

    const range =
        max - min === 0
            ? 1
            : max - min;

    const step =
        WIDTH / (data.length - 1);

    const points = data.map(
        (value, index) => ({
            x: index * step,
            y:
                HEIGHT -
                ((value - min) / range) *
                HEIGHT,
        }),
    );

    const path = points.reduce(
        (acc, point, index) => {

            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }

            const prev =
                points[index - 1];

            const cx =
                (prev.x + point.x) / 2;

            return (
                acc +
                ` C ${cx} ${prev.y},
                    ${cx} ${point.y},
                    ${point.x} ${point.y}`
            );

        },
        "",
    );

    return (

        <Svg
            width={WIDTH}
            height={HEIGHT}
        >

            <Defs>

                <LinearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >

                    <Stop
                        offset="0%"
                        stopColor="#60A5FA"
                    />

                    <Stop
                        offset="100%"
                        stopColor="#A78BFA"
                    />

                </LinearGradient>

            </Defs>

            <Path
                d={path}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

        </Svg>

    );
}