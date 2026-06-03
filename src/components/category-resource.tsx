import { StretchHorizontal } from "lucide-react";
import { Create, Datagrid, DateField, Edit, ImageField, ImageInput, List, required, ResourceProps, SimpleForm, TextField, TextInput } from "react-admin"

const CategoryList = () => (
    <List>
        <Datagrid rowClick="edit">
            <ImageField source="image.src" label="Image" />
            <TextField source="title" />
            <TextField source="description" />
            <DateField source="createdate" showTime label="Created At" />
            <DateField source="lastupdate" showTime label="Updated At" />
        </Datagrid>
    </List>
);


const CategoryForm = () => (
    <SimpleForm sanitizeEmptyValues>
        <ImageInput source="image" label="Image">
            <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="title" validate={[required()]} fullWidth />
        <TextInput source="description" fullWidth />
    </SimpleForm>
);


const CategoryCreate = () => (
    <Create>
        <CategoryForm />
    </Create>
);

const CategoryEdit = () => (
    <Edit>
        <CategoryForm />
    </Edit>
);

export const CategoryProps: ResourceProps = {
    icon: StretchHorizontal,
    name: "categories",
    list: CategoryList,
    create: CategoryCreate,
    edit: CategoryEdit
}