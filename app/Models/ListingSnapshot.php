<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingSnapshot extends Model
{
    protected $fillable =
        [
            'listing_id'
            , 'price'
            ,'snapshot_id'
        ];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }
}
