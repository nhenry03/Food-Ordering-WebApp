import { FunctionComponent, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { SpinnerBadge } from "./ui/badge";
import { ICategory, IItem, ILine, IOrder, IRestaurant } from "../models";
import { collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db, functions, auth } from "../utils/firebase";
import { httpsCallable } from "firebase/functions";
import { signInAnonymously } from "firebase/auth";

interface IDataProviderContext {
    lines: ILine[];
    restaurantInfo?: IRestaurant;
    categories: ICategory[];
    items: IItem[];
    order?: IOrder;
    getItemById: (itemId: string) => IItem | undefined;
    addToCart: (line: ILine) => void;
    updateLine: (index: number, line: ILine) => void;
    removeLine: (index: number) => void;
    checkout: (data: IOrder) => Promise<string>;
}

const DataProviderContext = createContext<IDataProviderContext>({
    lines: [],
    categories: [],
    items: [],
    getItemById: () => undefined,
    addToCart: () => { },
    updateLine: () => { },
    removeLine: () => { },
    checkout: () => Promise.resolve(""),
});

export const useDataProvider = () => {
    return useContext(DataProviderContext);
};

export const DataProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {

    const [isReady, setIsReady] = useState(false);
    const [restaurantInfo, setRestaurantInfo] = useState<IRestaurant>();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [items, setItems] = useState<IItem[]>([]);
    const [lines, setLines] = useState<ILine[]>([]);
    const [order, setOrder] = useState<IOrder>();

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

    const addToCart = (line: ILine) => {
        setLines(prevLines => {
            const existingIndex = prevLines.findIndex((pLine) => {
                if (pLine.itemId !== line.itemId) return false;
                if (pLine.instruction !== line.instruction) return false;

                const pVals = pLine.value || [];
                const lVals = line.value || [];
                if (pVals.length !== lVals.length) return false;

                const pSorted = [...pVals].sort((a, b) => a.variant.localeCompare(b.variant));
                const lSorted = [...lVals].sort((a, b) => a.variant.localeCompare(b.variant));

                for (let i = 0; i < pSorted.length; i++) {
                    if (pSorted[i].variant !== lSorted[i].variant) return false;
                    if (pSorted[i].value !== lSorted[i].value) return false;
                }
                return true;
            });

            if (existingIndex >= 0) {
                const newLines = [...prevLines];
                newLines[existingIndex] = {
                    ...newLines[existingIndex],
                    quantity: newLines[existingIndex].quantity + line.quantity
                };
                return newLines;
            } else {
                return [...prevLines, line];
            }
        });
    };

    const updateLine = (index: number, updatedLine: ILine) => {
        setLines(prevLines => {
            const newLines = [...prevLines];
            newLines[index] = updatedLine;
            return newLines;
        });
    };

    const removeLine = (index: number) => {
        setLines(prevLines => prevLines.filter((_, i) => i !== index));
    };

    const checkout = async (order: IOrder): Promise<string> => {
        const placeorder = httpsCallable<IOrder, { id: string, order: IOrder }>(
            functions,
            'placeorder',
        )
        const { data } = await placeorder({ ...order, lines });
        setLines([]);
        setOrder({ ...data.order, id: data.id } as any);
        onSnapshot(doc(db, 'order', data.id), (docSnapshot) => {
            setOrder({ ...docSnapshot.data(), id: docSnapshot.id } as any);
        });
        return data.id;
    }

    async function fetchData() {
        await signInAnonymously(auth)
        await fetchItems();
        await fetchCategories();
        await fetchRestaurantInfo();
        setIsReady(true);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataProviderContext.Provider value={{ lines, restaurantInfo, categories, items, getItemById, addToCart, updateLine, removeLine, checkout, order }}>
            {isReady ? children : (
                <div className="flex h-screen w-full items-center justify-center">
                    <SpinnerBadge />
                </div>
            )}
        </DataProviderContext.Provider>
    );
}