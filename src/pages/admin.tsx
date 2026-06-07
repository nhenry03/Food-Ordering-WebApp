import { AppBar, CustomRoutes, Layout, Admin as RAdmin, RefreshIconButton, Resource } from 'react-admin'
import { firebaseConfig } from '../utils/firebase'
import { RAFirebaseOptions, FirebaseDataProvider, FirebaseAuthProvider } from 'react-admin-firebase';
import { CategoryProps } from 'components/category-resource';
import { ItemProps } from 'components/item-resource';
import { Route } from 'react-router-dom';
import { Info } from 'components/info';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { OrderProps } from 'components/order-resource';

const options: RAFirebaseOptions = {
    logging: true,
    persistence: 'session',
    lazyLoading: {
        enabled: true,
    },
    watch: ["orders"],
};

const dataProvider = FirebaseDataProvider(firebaseConfig, options);
const authProvider = FirebaseAuthProvider(firebaseConfig, {});

export const MyAppBar = () => (
    <AppBar toolbar={
        <>
            <RefreshIconButton />
            <IconButton
                title="Restaurant Settings"
                href='/admin/info'
                style={{ color: 'white' }}
            >
                <SettingsIcon />
            </IconButton>
        </>
    }>

    </AppBar>
);

const MyLayout = (props: any) => <Layout {...props} appBar={MyAppBar} />

export const Admin = () => {
    return (
        <RAdmin layout={MyLayout} authProvider={authProvider} basename="/admin" dataProvider={dataProvider}>
            <Resource {...CategoryProps} />
            <Resource {...ItemProps} />
            <Resource {...OrderProps} />
            <CustomRoutes>
                <Route path="/info" element={<Info />} />
            </CustomRoutes>
        </RAdmin>
    );
};
