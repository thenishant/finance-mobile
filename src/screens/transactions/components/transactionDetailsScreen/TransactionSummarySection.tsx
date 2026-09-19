import React from "react";
import {AppText, Card, Stack} from "../../../../components/common";
import {spacing} from "../../../../design";
import {financeIcons, FinanceIconType} from "../../../../design/icons";
import AppIcon from "../../../../components/common/AppIcon";

interface Props {
    amount: string | number;
    merchant: string;
    date: string;
    type: FinanceIconType;
}

export default function TransactionSummarySection({
                                                      amount,
                                                      merchant,
                                                      date,
                                                      type,
                                                  }: Props) {
    const icon = financeIcons[type];

    return (
        <Card padding={spacing.lg}>
            <Stack spacing="sm" align="center">
                {/*<AppIcon type={type}/>*/}
                <AppText
                    variant="title"
                    weight="500"
                    style={[{color: icon.color}]}
                >
                    ₹{Number(amount).toLocaleString("en-IN")}
                </AppText>

                <AppText
                    variant="heading"
                    weight="400"
                    numberOfLines={2}
                >
                    {merchant}
                </AppText>
            </Stack>
        </Card>
    );
}

