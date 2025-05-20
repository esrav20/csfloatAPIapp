import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type Listing = {
    id: number;
    created_at: string;
    type: string;
    price: number;
    state: string;
    item: {
        market_hash_name: string;
        description: string;
        icon_url: string;
    };
    seller: {
        avatar: string;
        username: string;
    };
    snapshots: ListingSnapshot[];
};

export interface ListingSnapshot {
    id: number;
    listing_id: number;
    price: number | null;
    snapshot_at: string;
}

const ItemCard = ({ item }: { item: Listing }) => {
    const { id, created_at, type, price, state, item: item_data, seller, snapshots } = item;

    const imageUrl = item_data.icon_url.startsWith('http')
        ? item_data.icon_url
        : `https://steamcommunity-a.akamaihd.net/economy/image/${item_data.icon_url}`;

    return (
        <div className="mx-auto my-4 max-w-md overflow-hidden rounded-lg bg-white shadow-md">
            <div className="p-4">
                <h3 className="mb-2 text-xl font-bold">{item_data.market_hash_name}</h3>
                {/* New Image Section */}
                <img src={imageUrl} alt={item_data.market_hash_name} className="mb-4 w-full rounded-md" />

                <p className="text-sm text-gray-600">
                    <strong>ID:</strong> {id}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {type}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Price:</strong>{' '}
                    {Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(price! / 100)}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {state}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Created:</strong> {new Date(created_at).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center border-t border-gray-200 p-4">
                <img className="mr-4 h-10 w-10 rounded-full" src={seller.avatar} alt={`${seller.username} avatar`} />
                <div>
                    <p className="leading-none text-gray-900">
                        <strong>Seller:</strong> {seller.username}
                    </p>
                </div>
            </div>
            <div className="text-sm text-gray-700 p-4">
                <strong>Description:</strong>
                <div
                    className="mt-1"
                    dangerouslySetInnerHTML={{
                        __html: item_data.description ? item_data.description
                            .replace(/\\n/g, '<br />') // Convert literal \n to <br>
                            .trim(): "",
                    }}
                />
            </div>
            <div className="border-t border-gray-200 p-4">
                <p className="mb-1 text-sm font-semibold text-gray-700">Price on last snapshot:</p>
                {snapshots.map((snapshot) => (
                    <p key={snapshot.id} className="text-sm text-gray-600">
                        {Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        }).format(snapshot.price! / 100)}
                    </p>
                ))}
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
