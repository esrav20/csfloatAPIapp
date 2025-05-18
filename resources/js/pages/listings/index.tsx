import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head } from '@inertiajs/react';

type Listing = {
    id: number;
    created_at: string;
    type: string;
    price: number;
    state: string;
    item_data: {
        market_hash_name: string;
        description: string;
    };
    seller_data: {
        avatar: string;
        username: string;
    };
};
const ItemCard = ({ item }: {item: Listing}) => {
    const { id, created_at, type, price, state, item_data, seller_data } = item;


    return (
        <div className="mx-auto my-4 max-w-md overflow-hidden rounded-lg bg-white shadow-md">
            <div className="p-4">
                <h3 className="mb-2 text-xl font-bold">{item_data.market_hash_name}</h3>
                <p className="text-sm text-gray-600">
                    <strong>ID:</strong> {id}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {type}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Price:</strong> {price}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {state}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Created:</strong> {new Date(created_at).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center border-t border-gray-200 p-4">
                <img className="mr-4 h-10 w-10 rounded-full" src={seller_data.avatar} alt={`${seller_data.username} avatar`} />
                <div>
                    <p className="leading-none text-gray-900">
                        <strong>Seller:</strong> {seller_data.username}
                    </p>
                </div>
            </div>
            <div className="border-t border-gray-200 p-4">
                <p className="text-sm text-gray-700">
                    <strong>Description:</strong> {item_data.description}
                </p>
            </div>
        </div>
    );
};
export default function Index({ listings }: { listings: Listing[] }) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>Listings</div>
                {listings.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </AppLayout>
    );
}
