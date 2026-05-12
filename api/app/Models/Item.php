<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'status',
        'description',
        'interior_photo',
        'exterior_photo',
        'brand',
        'model',
        'neighborhood',
        'bedrooms',
        'has_water',
        'has_electricity',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
