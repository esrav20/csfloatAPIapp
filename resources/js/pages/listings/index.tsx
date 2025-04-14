import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


// @ts-ignore
const ItemCard = ({ item }) => {
    const {
        id,
        created_at,
        type,
        price,
        state,
        seller,
        item: itemDetails
    } = item;

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden my-4">
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{itemDetails.market_hash_name}</h3>
                <p className="text-gray-600 text-sm"><strong>ID:</strong> {id}</p>
                <p className="text-gray-600 text-sm"><strong>Type:</strong> {type}</p>
                <p className="text-gray-600 text-sm"><strong>Price:</strong> {price}</p>
                <p className="text-gray-600 text-sm"><strong>Status:</strong> {state}</p>
                <p className="text-gray-600 text-sm">
                    <strong>Created:</strong> {new Date(created_at).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center p-4 border-t border-gray-200">
                <img
                    className="w-10 h-10 rounded-full mr-4"
                    src={seller.avatar}
                    alt={`${seller.username} avatar`}
                />
                <div>
                    <p className="text-gray-900 leading-none"><strong>Seller:</strong> {seller.username}</p>
                </div>
            </div>
            <div className="p-4 border-t border-gray-200">
                <p className="text-gray-700 text-sm">
                    <strong>Description:</strong> {itemDetails.description}
                </p>
            </div>
        </div>
    );
};
export default function Index({listings}) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>hej</div>
                {listings.map(item => (
                <ItemCard key={item.id} item={item} />)
                )}
            </div>
        </AppLayout>
    );

}
