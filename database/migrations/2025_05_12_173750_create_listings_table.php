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
            $table->string('title'); // navn
            $table->text('description')->nullable(); // beskrivelse
            $table->decimal('price', 10, 2); // Price with 2 decimal points
            $table->string('external_id')->unique(); // To track external API items
            $table->timestamps(); // Created_at and Updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('listings');
    }
};
