import React from "react";
import {View} from "react-native";
import {TRANSACTION_TYPES, TransactionType} from "../../../types/transaction";
import {PillGroup} from "../../ui";

interface Props {
    value: TransactionType;
    onChange: (v: TransactionType) => void;
}

export const TransactionTypeSection = ({
                                           value,
                                           onChange,
                                       }: Props) => (
    <View style={{marginTop: 16}}>
        <PillGroup
            label="Transaction Type"
            required
            data={TRANSACTION_TYPES}
            value={value}
            onChange={onChange}
        />
    </View>
);