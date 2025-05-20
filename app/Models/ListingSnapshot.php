<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingSnapshot extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'listing_id',
        'price',
        'snapshot_at'
    ];

    public function listing(){
        return $this->belongsTo(Listing::class);
    }
}
