<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            'Kinshasa' => ['Gombe', 'Limete', 'Ngaliema', 'Bandalungwa', 'Lemba'],
            'Kongo Central' => ['Matadi', 'Boma', 'Moanda', 'Kasangulu'],
            'Haut-Katanga' => ['Lubumbashi', 'Likasi', 'Kipushi', 'Kasumbalesa'],
            'Nord-Kivu' => ['Goma', 'Beni', 'Butembo'],
            'Sud-Kivu' => ['Bukavu', 'Uvira', 'Walungu']
        ];

        foreach ($locations as $provinceName => $cities) {
            $provinceId = \Illuminate\Support\Facades\DB::table('provinces')->insertGetId([
                'name' => $provinceName,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            foreach ($cities as $cityName) {
                \Illuminate\Support\Facades\DB::table('cities')->insert([
                    'province_id' => $provinceId,
                    'name' => $cityName,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
