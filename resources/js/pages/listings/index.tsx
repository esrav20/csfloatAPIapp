import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

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

type Filters = {
    type?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
};

type Props = {
    listings: Listing[];
    filters: Filters;
};

const ItemCard = ({ item }: { item: Listing }) => {
    const { id, created_at, type, price, state, item: item_data, seller, snapshots } = item;

    const imageUrl = item_data.icon_url.startsWith('http')
        ? item_data.icon_url
        : `https://steamcommunity-a.akamaihd.net/economy/image/${item_data.icon_url}`;

    return (
        <div className="mx-auto my-4 max-w-md overflow-hidden rounded-lg bg-black text-white shadow-md dark:bg-white dark:text-black">
            <div className="p-4">
                <h3 className="mb-2 text-xl font-bold">{item_data.market_hash_name}</h3>
                <img src={imageUrl} alt={item_data.market_hash_name} className="mb-4 w-full rounded-md" />

                {/* All these text elements need to inherit the parent's color or be explicitly set */}
                <p className="text-sm"><strong>ID:</strong> {id}</p>
                <p className="text-sm"><strong>Type:</strong> {type}</p>
                <p className="text-sm"><strong>Price:</strong> {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(price! / 100)}</p>
                <p className="text-sm"><strong>Status:</strong> {state}</p>
                <p className="text-sm"><strong>Created:</strong> {new Date(created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center border-t border-gray-700 dark:border-gray-200 p-4"> {/* Adjusted border color */}
                <img className="mr-4 h-10 w-10 rounded-full" src={seller.avatar} alt={`${seller.username} avatar`} />
                <div><p className="leading-none"><strong>Seller:</strong> {seller.username}</p></div> {/* Removed text-gray-900 */}
            </div>
            <div className="text-sm p-4"> {/* Removed text-gray-700 */}
                <strong>Description:</strong>
                <div
                    className="mt-1"
                    dangerouslySetInnerHTML={{
                        __html: item_data.description ? item_data.description.replace(/\\n/g, '<br />').trim() : "",
                    }}
                />
            </div>
            <div className="border-t border-gray-700 dark:border-gray-200 p-4"> {/* Adjusted border color */}
                <p className="mb-1 text-sm font-semibold">Price on last snapshot:</p> {/* Removed text-gray-700 */}
                {snapshots.map((snapshot) => (
                    <p key={snapshot.id} className="text-sm"> {/* Removed text-gray-600 */}
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

export default function Index({ listings, filters }: Props) {
    const { data, setData, get } = useForm<Filters>({
        type: filters.type || '',
        sort: filters.sort || '',
        direction: filters.direction || 'desc',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('listings.index'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Listings</h1>

                {/* Filter + sort form */}
                <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <input
                            type="text"
                            name="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sort by</label>
                        <select
                            name="sort"
                            value={data.sort}
                            onChange={(e) => setData('sort', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="">Default</option>
                            <option value="price">Price</option>
                            <option value="created_at">Created At</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Direction</label>
                        <select
                            name="direction"
                            value={data.direction}
                            onChange={(e) => setData('direction', e.target.value as 'asc' | 'desc')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="asc">Asc</option>
                            <option value="desc">Desc</option>
                        </select>
                    </div>

                    <div className="self-end">
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm">
                            Filter
                        </button>
                    </div>
                </form>

                {/* Listings */}
                <div className="flex flex-wrap gap-4">
                    {listings.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
