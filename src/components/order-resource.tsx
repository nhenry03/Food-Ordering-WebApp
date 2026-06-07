import { style } from "@mui/system";
import { Receipt } from "lucide-react";
import { ArrayField, ArrayInput, BooleanInput, ChipField, Create, Datagrid, DateField, Edit, ImageField, ImageInput, Labeled, List, number, NumberField, NumberInput, ReferenceField, ReferenceInput, required, ResourceProps, SelectInput, SimpleForm, SimpleFormIterator, TextField, TextInput } from "react-admin"
import { ORDER_STATUS } from "utils/orderInfo";

const OrderList = () => (
    <List
        sort={{ field: "pickupTime", order: "DESC" }}
    >
        <Datagrid rowClick="edit"
            bulkActionButtons={false}
            rowStyle={record => {
                if (record.status === "pending") return { backgroundColor: "grey" };
                if (record.status === "cancelled") return { backgroundColor: "#ba3232" };
                if (record.status === "completed") return { backgroundColor: "#2bd9ab" };
                return {};
            }}>
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="email" />
            <TextField source="phone" />
            <ChipField source="status" />
            <NumberField source="total" options={{ style: "currency", currency: "NZD" }} />
            <DateField source="pickupTime" showTime label="Pickup Time" />
        </Datagrid>
    </List>
);


const OrderForm = () => (
    <SimpleForm sanitizeEmptyValues>
        <Labeled label="First Name">
            <TextField source="firstName" />
        </Labeled>
        <Labeled label="Last Name">
            <TextField source="lastName" />
        </Labeled>
        <Labeled label="Email">
            <TextField source="email" />
        </Labeled>
        <Labeled label="Phone">
            <TextField source="phone" />
        </Labeled>
        <Labeled label="Comments">
            <TextField source="comments" />
        </Labeled>
        <Labeled label="Total">
            <NumberField source="total" options={{ style: "currency", currency: "NZD" }} />
        </Labeled>
        <SelectInput source="status" choices={ORDER_STATUS} />
        <ArrayField source="lines">
            <Datagrid bulkActionButtons={false}>
                <TextField source="label" />
                <NumberField source="price" options={{ style: "currency", currency: "NZD" }} />
                <NumberField source="quantity" />
                <TextField source="comments" />
                <ArrayField source="value">
                    <Datagrid bulkActionButtons={false}>
                        <TextField source="value" />
                        <NumberField source="price" options={{ style: "currency", currency: "NZD" }} />
                    </Datagrid>
                </ArrayField>
            </Datagrid>
        </ArrayField>
    </SimpleForm>
);

const OrderEdit = () => (
    <Edit>
        <OrderForm />
    </Edit>
);

export const OrderProps: ResourceProps = {
    icon: Receipt,
    name: "order",
    list: OrderList,
    edit: OrderEdit
}