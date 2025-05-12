<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

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
        // Fetch the data from the external API
        $response = Http::withHeaders([
            "Authorization" => $this->apiKey,
        ])
            ->get("{$this->baseUrl}/{$endpoint}")
            ->json();

        // Process and store listings in the database
        foreach ($response['listings'] as $listing) {
            Listing::updateOrCreate(
                ['external_id' => $listing['id']],
                [
                    'title' => $listing['title'],
                    'description' => $listing['description'] ?? '',
                    'price' => $listing['price'],
                    'external_id' => $listing['id'],
                ]
            );
        }

        return $response['listings'];
    }
}
