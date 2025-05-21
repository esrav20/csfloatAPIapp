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

        $listings = Listing::query()
            ->when($request->input('type'), fn($q, $type) => $q->where('type', $type))
            ->when($request->input('sort'), function ($q, $sort) use ($request) {
                $direction = $request->input('direction', 'asc');
                return $q->orderBy($sort, $direction);
            })
            ->with('snapshots')
            ->get();

        return Inertia::render('listings/index', [
            'listings' => $listings,
            'filters' => $request->only('type', 'sort', 'direction'),
        ]);
    }
}
