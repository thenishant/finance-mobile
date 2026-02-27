import React from "react";
import {View} from "react-native";
import {PAYMENT_METHODS, PaymentMethod} from "../../../types/payment";
import {PillGroup} from "../../ui";

interface Props {
    value: PaymentMethod;
    onChange: (v: PaymentMethod) => void;
}

export const PaymentSection = ({
                                   value,
                                   onChange,
                               }: Props) => (
    <View style={{marginTop: 16}}>
        <PillGroup
            label="Payment Method"
            required
            data={PAYMENT_METHODS}
            value={value}
            onChange={onChange}
        />
    </View>
);