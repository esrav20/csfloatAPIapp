<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CSFloatService;
use App\Models\Listing;
use App\Models\ListingSnapshot;
use Inertia\Inertia;

class ListingController extends Controller

{
    public function index(Request $request)
    {
        $query = $request->input('query');

        $listings = Listing::query()
            ->when($request->input('query'), function ($q, $query) {
                $q->where(function ($sub) use ($query) {
                    $sub->where('id', 'like', "%{$query}%")
                        ->orWhere('type', 'like', "%{$query}%")
                        ->orWhere('item->market_hash_name', 'like', "%{$query}%"); // JSON path
                });
            })
            ->when($request->input('sort'), function ($q, $sort) use ($request) {
                $direction = $request->input('direction', 'asc');
                return $q->orderBy($sort, $direction);
            })
            ->with('snapshots')
            ->get();

        return Inertia::render('listings/index', [
            'listings' => $listings,
            'filters' => $request->only('query', 'sort', 'direction'),
        ]);
    }
}
