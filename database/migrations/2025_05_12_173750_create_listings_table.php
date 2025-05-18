<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('listings', function (Blueprint $table) {

            $table->id();

            $table->string('external_id')->unique(); // your "id" from JSON as string
            $table->string('type')->nullable();
            $table->unsignedBigInteger('price')->nullable();
            $table->string('state')->nullable();
            $table->json('seller')->nullable();  // Store whole seller object as JSON
            $table->json('item')->nullable();    // Store whole item object as JSON
            $table->boolean('is_seller')->default(false);
            $table->unsignedBigInteger('min_offer_price')->nullable();
            $table->unsignedInteger('max_offer_discount')->nullable();
            $table->boolean('is_watchlisted')->default(false);
            $table->unsignedInteger('watchers')->default(0);
            $table->timestamp('snapshot_taken_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('listings');
    }
};
