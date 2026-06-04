import { useDataProvider } from "components/data-provider";

export const Info = () => {
    const { restaurantInfo } = useDataProvider();

    if (!restaurantInfo) {
        return null;
    }

    return (
        <div>
            <p> Restaurant Name: {restaurantInfo?.name}</p>
        </div>
    );
}