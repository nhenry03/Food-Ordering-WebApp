import { FunctionComponent, PropsWithChildren, createContext, useState } from "react";
import { SpinnerBadge } from "./ui/badge";

interface IDataProviderContext { }

const DataProviderContext = createContext<IDataProviderContext>({});

export const DataProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {

    const [isReady, setIsReady] = useState(false);
    return (
        <DataProviderContext.Provider value={{}}>
            {isReady ? children : (
                <div className="flex h-screen w-full items-center justify-center">
                    <SpinnerBadge />
                </div>
            )}
        </DataProviderContext.Provider>
    );
}