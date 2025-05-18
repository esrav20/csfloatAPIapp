<?php

namespace App\Services;

use App\Models\Listing;
use Illuminate\Support\Facades\Http;
use App\Models\ListingSnapshot;

class CSFloatService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.csfloat.api_url');
        $this->apiKey = config('services.csfloat.api_key');
    }

    public function fetchAndStoreListings($endpoint)
    {
        // Henter data fra Api via HTTP request med API key fra .env
        $response = Http::withHeaders([
            "Authorization" => $this->apiKey,
            ])->get("{$this->baseUrl}/{$endpoint}");

        if (!$response->successful()) {
            throw new \Exception("API fejl: " . $response->body());
            }
        $data = $response->json("data");

        foreach ($data as $listing) {
            // Vi finder eller opretter et nyt Listing objekt.
            $listingModel = Listing::updateOrCreate(
                ['external_id' => $listing['id']],
                [
                    'title' => $listing['item']['item_name'],
                    'description' => $listing['item']['item_description'],
                    'price' => $listing['price'],
                    'external_id' => $listing['id'],
                    'seller_data' => $listing['seller_data'],
                    'item_data' => $listing['item_data'],
                ]
            );
        }
        ListingSnapshot::create([
            'listing_id' => $listingModel->id,
            'price' => $listing['price'],
            'snapshot_at' => now(),
        ]);

        return $data;
    }
}
