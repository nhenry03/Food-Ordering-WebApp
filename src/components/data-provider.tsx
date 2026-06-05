import { FunctionComponent, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { SpinnerBadge } from "./ui/badge";
import { ICategory, IItem, IRestaurant } from "../models";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

interface IDataProviderContext {
    restaurantInfo?: IRestaurant;
    categories: ICategory[];
    items: IItem[];
    getItemById: (itemId: string) => IItem | undefined;
}

const DataProviderContext = createContext<IDataProviderContext>({
    categories: [],
    items: [],
    getItemById: () => undefined,
});

export const useDataProvider = () => {
    return useContext(DataProviderContext);
};

export const DataProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {

    const [isReady, setIsReady] = useState(false);
    const [restaurantInfo, setRestaurantInfo] = useState<IRestaurant>();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [items, setItems] = useState<IItem[]>([]);

    const fetchCategories = async () => {
        const docSnap = await getDocs(collection(db, 'categories'));
        const dbCategories: ICategory[] = [];
        docSnap.forEach((item) => {
            const category = item.data() as ICategory;
            dbCategories.push(category);
        });
        setCategories(dbCategories);
    };

    const fetchItems = async () => {
        const docSnap = await getDocs(collection(db, 'items'));
        const dbItems: IItem[] = [];
        docSnap.forEach((item) => {
            const itemData = item.data() as IItem;
            dbItems.push(itemData);
        });
        setItems(dbItems);
    };

    const fetchRestaurantInfo = async () => {
        const docSnap = await getDoc(doc(db, 'restaurant', 'info'));
        setRestaurantInfo(docSnap.data() as IRestaurant);
    };

    const getItemById = (itemId: string) => {
        return items.find((item) => item.id === itemId);
    };

    async function fetchData() {
        await fetchItems();
        await fetchCategories();
        await fetchRestaurantInfo();
        setIsReady(true);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataProviderContext.Provider value={{ restaurantInfo, categories, items, getItemById }}>
            {isReady ? children : (
                <div className="flex h-screen w-full items-center justify-center">
                    <SpinnerBadge />
                </div>
            )}
        </DataProviderContext.Provider>
    );
}