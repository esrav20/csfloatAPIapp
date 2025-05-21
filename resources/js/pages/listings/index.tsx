import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

type ItemCardProps = {
    item: Listing;
    isExpanded: boolean;
    onToggle: () => void;
};

export interface ListingSnapshot {
    id: number;
    listing_id: number;
    price: number | null;
    snapshot_at: string;
}

type Filters = {
    query?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
};

type Props = {
    listings: Listing[];
    filters: Filters;
};

const ItemCard = ({ item, isExpanded, onToggle }: ItemCardProps) => {
    const { id, created_at, type, price, state, item: item_data, seller, snapshots } = item;

    const uniqueSnapshots = Array.from(
        new Map(snapshots.map((s) => [s.price, s])).values()
    ).sort((a, b) => new Date(a.snapshot_at).getTime() - new Date(b.snapshot_at).getTime());

    const chartData = {
        labels: uniqueSnapshots.map((s) => new Date(s.snapshot_at).toLocaleString()),
        datasets: [
            {
                label: 'Price (USD)',
                data: uniqueSnapshots.map((s) => (s.price ?? 0) / 100),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.2,
            },
        ],
    };

    const imageUrl = item_data.icon_url.startsWith('http')
        ? item_data.icon_url
        : `https://steamcommunity-a.akamaihd.net/economy/image/${item_data.icon_url}`;

    return (
        <div className="mx-auto my-4 max-w-md overflow-hidden rounded-lg bg-black text-white shadow-md dark:bg-white dark:text-black">
            <div className="cursor-pointer p-4" onClick={onToggle}>
                <h3 className="mb-2 text-xl font-bold">{item_data.market_hash_name}</h3>
                <img src={imageUrl} alt={item_data.market_hash_name} className="mb-4 w-full rounded-md" />

                <p className="text-sm">
                    <strong>ID:</strong> {id}
                </p>
                <p className="text-sm">
                    <strong>Type:</strong> {type}
                </p>
                <p className="text-sm">
                    <strong>Price:</strong>{' '}
                    {Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(price! / 100)}
                </p>
                <p className="text-sm">
                    <strong>Status:</strong> {state}
                </p>
                <p className="text-sm">
                    <strong>Created:</strong> {new Date(created_at).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center border-t border-gray-700 p-4 dark:border-gray-200">
                <img className="mr-4 h-10 w-10 rounded-full" src={seller.avatar} alt={`${seller.username} avatar`} />
                <div>
                    <p className="leading-none">
                        <strong>Seller:</strong> {seller.username}
                    </p>
                </div>
            </div>
            <div className="p-4 text-sm">
                <strong>Description:</strong>
                <div
                    className="mt-1"
                    dangerouslySetInnerHTML={{
                        __html: item_data.description ? item_data.description.replace(/\\n/g, '<br />').trim() : '',
                    }}
                />
            </div>
            <div className="border-t border-gray-700 p-4 dark:border-gray-200">
                <p className="mb-1 text-sm font-semibold">Price on last snapshot:</p>
                {snapshots.map((snapshot) => (
                    <p key={snapshot.id} className="text-sm">
                        {Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        }).format(snapshot.price! / 100)}
                    </p>
                ))}
            </div>
            {isExpanded && (
                <div className="p-4 border-t border-gray-700 dark:border-gray-200 bg-white">
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default function Index({ listings, filters }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };
    const { data, setData, get } = useForm<Filters>({
        query: filters.query || '',
        sort: filters.sort || '',
        direction: (filters.direction ?? 'desc') as 'asc' | 'desc',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('listings'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <form onSubmit={handleSubmit} className="p-4 mb-6 flex flex-wrap gap-4">
                {/* Search Input */}
                <div>
                    <label htmlFor="search-input"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                    <input
                        id="search-input"
                        type="text"
                        name="query"
                        value={data.query}
                        onChange={(e) => setData('query', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 p-2"
                        placeholder="Search by name, type, or ID" />
                </div>
                {/* Sort by Dropdown */}
                <div>
                    <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort
                        by</label>
                    <select
                        id="sort-select"
                        name="sort"
                        value={data.sort}
                        onChange={(e) => setData('sort', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 p-2
                       appearance-none pr-8 bg-no-repeat bg-right-center"
                    >
                        <option value="">Default</option>
                        <option value="price">Price</option>
                        <option value="created_at">Created At</option>
                    </select>
                </div>
                {/* Direction Dropdown */}
                <div>
                    <label htmlFor="direction-select"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">Direction</label>
                    <select
                        id="direction-select"
                        name="direction"
                        value={data.direction}
                        onChange={(e) => setData('direction', e.target.value as 'asc' | 'desc')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 p-2
                       appearance-none pr-8 bg-no-repeat bg-right-center"
                    >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                    </select>
                </div>
                <div className="self-end">
                    <button type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700">
                        Filter
                    </button>
                </div>
            </form>
            <div className="flex flex-wrap justify-center gap-6">
            {listings.length === 0 ? (
            <p className="text-gray-600">No listings found.</p>
             ) : (
            listings.map((item) => (
                <ItemCard key={item.id} item={item} isExpanded={item.id === expandedId}
                          onToggle={() => handleToggle(item.id)} />
            ))
        )}
    </div>
</AppLayout>
);
}
