<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    public function provinces()
    {
        $provinces = DB::table('provinces')->select('id', 'name')->orderBy('name')->get();
        return response()->json(['provinces' => $provinces]);
    }

    public function cities($province_id)
    {
        $cities = DB::table('cities')
            ->where('province_id', $province_id)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
        return response()->json(['cities' => $cities]);
    }
}
