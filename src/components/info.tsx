import { Card } from "@mui/material"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNotify, CheckboxGroupInput, SaveButton, SimpleForm, TextInput, TimeInput, Toolbar } from "react-admin"
import { db } from "utils/firebase";
import { PAYMENT_METHODS } from "utils/restaurantInfo"

// Custom toolbar with only a Save button — no DeleteButton,
// because this is a standalone settings page (not a Resource record).
const InfoToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

export const Info = () => {
    const restaurantRef = doc(db, 'restaurant', 'info')
    const notify = useNotify();
    const [defaultValue, setDefaultValue] = useState<any>()
    const handleSubmit = async (data: any) => {
        await setDoc(restaurantRef, data)
        notify(`Restaurant information updated`, { type: 'success' })
    }

    const fetchData = async () => {
        const snapShot = await getDoc(restaurantRef)
        setDefaultValue(snapShot.data() || {})
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (!defaultValue) return null;

    return (
        <Card>
            <SimpleForm defaultValues={{
                ...defaultValue,
                openingTime: defaultValue.openingTime.toDate(),
                closingTime: defaultValue.closingTime.toDate()
            }}
                sanitizeEmptyValues toolbar={<InfoToolbar />} onSubmit={handleSubmit}>
                <TextInput source="name" fullWidth />
                <TextInput source="address" fullWidth />
                <TextInput source="phone" fullWidth />
                <TimeInput source="openingTime" fullWidth />
                <TimeInput source="closingTime" fullWidth />
                <CheckboxGroupInput source="paymentMethods" choices={PAYMENT_METHODS} />
            </SimpleForm>
        </Card >
    )
}