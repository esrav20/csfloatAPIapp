<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CSFloatService;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function index()
    {
        $services = new CSFloatService();
        $listings = $services->fetchData("listings")["data"];
        return Inertia::render('listings/index', ["listings" => $listings]);

    }
}
