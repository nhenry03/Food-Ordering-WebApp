import { LayoutList } from "lucide-react";
import { ArrayInput, BooleanInput, ChipField, Create, Datagrid, DateField, Edit, ImageField, ImageInput, List, number, NumberField, NumberInput, ReferenceField, ReferenceInput, required, ResourceProps, SelectInput, SimpleForm, SimpleFormIterator, TextField, TextInput } from "react-admin"

const ItemList = () => (
    <List>
        <Datagrid rowClick="edit">
            <ImageField source="image.src" label="Image" />
            <TextField source="label" />
            <ReferenceField source="category" reference="categories" >
                <ChipField source="title" />
            </ReferenceField >
            <NumberField source="price" />
            <TextField source="description" />
            <DateField source="createdate" showTime label="Created At" />
            <DateField source="lastupdate" showTime label="Updated At" />
        </Datagrid>
    </List>
);


const ItemForm = () => (
    <SimpleForm sanitizeEmptyValues>
        <ImageInput source="image" label="Image">
            <ImageField source="src" title="title" />
        </ImageInput>
        <ReferenceInput label="category" source="category" reference="categories">
            <SelectInput optionText="title" fullWidth validate={[required()]} />
        </ReferenceInput>
        <TextInput source="label" validate={[required()]} fullWidth />
        <NumberInput source="price" validate={[required(), number()]} fullWidth />
        <TextInput source="description" fullWidth />
        <ArrayInput source="variants">
            <SimpleFormIterator fullWidth>
                <TextInput source="type" helperText={false} />
                <ArrayInput source="choices">
                    <SimpleFormIterator fullWidth inline>
                        <TextInput source="label" />
                        <NumberInput source="price" defaultValue={0} />
                    </SimpleFormIterator>
                </ArrayInput>
                <BooleanInput source="allowedMultiple" helperText={false} />
                <BooleanInput source="isRequired" helperText={false} />
            </SimpleFormIterator>
        </ArrayInput>
    </SimpleForm>
);


const ItemCreate = () => (
    <Create>
        <ItemForm />
    </Create>
);

const ItemEdit = () => (
    <Edit>
        <ItemForm />
    </Edit>
);

export const ItemProps: ResourceProps = {
    icon: LayoutList,
    name: "items",
    list: ItemList,
    create: ItemCreate,
    edit: ItemEdit
}