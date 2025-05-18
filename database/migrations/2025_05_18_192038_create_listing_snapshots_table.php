<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listing_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->references('id')->on('listings')->onDelete('cascade');
            $table->unsignedBigInteger('price')->nullable();
            $table->timestamp('snapshot_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_snapshots');
    }
};
