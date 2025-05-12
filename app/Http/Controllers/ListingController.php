<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CSFloatService;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('search', '');

        // Fetch listings and filter when a query is provided
        $listings = Listing::query()
            ->when($query, function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->paginate(10);


        return Inertia::render('Listings/Index', [
            'listings' => $listings,
            'filters' => [
                'search' => $query,
            ],
        ]);
    }
}
