<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $fillable = [
        'external_id',
        'created_at',
        'type',
        'price',
        'state',
        'seller',
        'item',
        'is_seller',
        'min_offer_price',
        'max_offer_discount',
        'is_watchlisted',
        'watchers',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'seller' => 'array',    // cast JSON to array automatically
        'item' => 'array',
        'is_seller' => 'boolean',
        'is_watchlisted' => 'boolean',
    ];
}
