<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CSFloatService;
use App\Models\Listing;
use App\Models\ListingSnapshot;
use Inertia\Inertia;

public function index(Request $request)
{
    $query = $request->input('query');

    $listings = Listing::query()
        ->when($query, function ($q) use ($query) {
            $q->where(function ($subQ) use ($query) {
                $subQ->where('market_hash_name', 'like', "%$query%")
                    ->orWhere('type', 'like', "%$query%")
                    ->orWhere('id', $query);
            });
        })
        ->when($request->input('sort'), function ($q, $sort) use ($request) {
            $direction = $request->input('direction', 'asc');
            $q->orderBy($sort, $direction);
        })
        ->with('snapshots')
        ->get();

    return Inertia::render('listings/index', [
        'listings' => $listings,
        'filters' => $request->only('query', 'sort', 'direction'),
    ]);
}
