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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['vehicle', 'house']);
            $table->boolean('status')->default(true);
            $table->text('description')->nullable();
            $table->string('interior_photo')->nullable();
            $table->string('exterior_photo')->nullable();
            
            // Vehicle specific
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            
            // House specific
            $table->string('neighborhood')->nullable();
            $table->integer('bedrooms')->nullable();
            $table->boolean('has_water')->nullable();
            $table->boolean('has_electricity')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
