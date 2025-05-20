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

        // Fetch listings and filter when a query is provided
        $listings = Listing::query()
            ->with("snapshots")
            ->latest()
            ->get();


        return Inertia::render('listings/index', [
            'listings' => $listings,
        ]);
    }
}
