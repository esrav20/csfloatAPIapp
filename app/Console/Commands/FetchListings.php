<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CSFloatService;

class FetchListings extends Command
{
    protected $signature = 'listings:fetch';
    protected $description = 'Henter og gemmer CSFloat listings med snapshots';

    public function handle()
    {
        $this->info("Henter data fra CSFloat...");
        app(CSFloatService::class)->fetchAndStoreListings('listings');
        $this->info("Færdig!");
    }
}
