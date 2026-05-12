<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;
use Illuminate\Support\Facades\Validator;

class ItemController extends Controller
{
    /**
     * Get a paginated list of items with filters
     */
    public function index(Request $request)
    {
        $query = Item::with('user:id,name,whatsapp_number,province,city,avatar')
                     ->where('status', true)
                     ->where('is_deleted', false)
                     ->latest();

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        
        if ($request->has('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function($q) use ($search) {
                $q->where('brand', 'ilike', $search)
                  ->orWhere('model', 'ilike', $search)
                  ->orWhere('neighborhood', 'ilike', $search);
            });
        }

        $items = $query->paginate(10);

        return response()->json($items);
    }

    /**
     * Get items belonging to the authenticated provider
     */
    public function myItems(Request $request)
    {
        $items = Item::where('user_id', $request->user()->id)
                     ->where('is_deleted', false)
                     ->latest()
                     ->get();

        return response()->json(['items' => $items]);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'type' => 'required|in:vehicle,house',
            'description' => 'required|string',
            'status' => 'boolean',
            'interior_photo' => 'nullable|url',
            'exterior_photo' => 'nullable|url',
        ];

        if ($request->type === 'vehicle') {
            $rules['brand'] = 'required|string';
            $rules['model'] = 'required|string';
        } elseif ($request->type === 'house') {
            $rules['neighborhood'] = 'required|string';
            $rules['bedrooms'] = 'required|integer|min:1';
            $rules['has_water'] = 'required|boolean';
            $rules['has_electricity'] = 'required|boolean';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $itemData = $request->only(array_keys($rules));
        $itemData['user_id'] = $request->user()->id;

        $item = Item::create($itemData);

        return response()->json([
            'message' => 'Item created successfully',
            'item' => $item
        ], 201);
    }

    /**
     * Display the specified item.
     */
    public function show($id)
    {
        $item = Item::with('user:id,name,whatsapp_number,province,city,avatar')->findOrFail($id);
        return response()->json(['item' => $item]);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        if ($item->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $rules = [
            'status' => 'boolean',
            'description' => 'string',
            'interior_photo' => 'nullable|url',
            'exterior_photo' => 'nullable|url',
        ];

        if ($item->type === 'vehicle') {
            $rules['brand'] = 'string';
            $rules['model'] = 'string';
        } elseif ($item->type === 'house') {
            $rules['neighborhood'] = 'string';
            $rules['bedrooms'] = 'integer|min:1';
            $rules['has_water'] = 'boolean';
            $rules['has_electricity'] = 'boolean';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item->update($request->only(array_keys($rules)));

        return response()->json([
            'message' => 'Item updated successfully',
            'item' => $item
        ]);
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        if ($item->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->update(['is_deleted' => true, 'status' => false]);

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
