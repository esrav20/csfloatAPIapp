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

    public function fetchData($endpoint)
    {
        return Http::withHeaders(["Authorization"=>$this->apiKey])
            ->get("{$this->baseUrl}/{$endpoint}")
            ->json();
    }
};
