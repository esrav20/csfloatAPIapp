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
            ])->get("{$this->baseUrl}/{$endpoint}", ["sort_by" => "most_recent"]);

        if (!$response->successful()) {
            throw new \Exception("API fejl: " . $response->body());
            }
        $data = $response->json("data");

        foreach ($data as $listing) {
            $listingModel = Listing::where('external_id', $listing['id'])->first();
            if (!$listingModel) {
                $listingModel = Listing::create(
                    [
                        'external_id' => $listing['id'],
                        'type' => $listing['type'],
                        'created_at' => $listing['created_at'],
                        'price' => $listing['price'],
                        'state' => $listing['state'],
                        'seller' => $listing['seller'],
                        'item' => $listing['item'],
                        'is_seller' => $listing['is_seller'],
                        'min_offer_price' => $listing['min_offer_price'] ?? null,
                        'max_offer_discount' => $listing['max_offer_discount'] ?? null,
                        'is_watchlisted' => $listing['is_watchlisted'],
                        'watchers' => $listing['watchers']
                    ]

                );
            }
            ListingSnapshot::create(
                [
                'listing_id' => $listingModel->id,
                'price' => $listing['price'],
                'snapshot_at' => now(),
            ]);
        }


        return $data;
    }
}
