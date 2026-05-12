<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Authenticate or Register a Provider via Google
     */
    public function googleAuth(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'name' => 'required|string',
            'google_id' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Update google_id and avatar if missing
            $user->update([
                'google_id' => $request->google_id,
                'avatar' => $request->avatar,
            ]);

            $token = $user->createToken('mobile-app')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ]);
        }

        // New provider registration needs extra fields
        $extraValidator = Validator::make($request->all(), [
            'province' => 'required|string',
            'city' => 'required|string',
            'whatsapp_number' => ['required', 'string', 'regex:/^\+[1-9]\d{9,14}$/'],
        ], [
            'whatsapp_number.regex' => "Le numéro WhatsApp doit commencer par un '+' suivi du code pays et du numéro, sans espaces (ex: +243810000000)."
        ]);

        if ($extraValidator->fails()) {
            return response()->json([
                'message' => 'registration_required',
                'errors' => $extraValidator->errors()
            ], 422);
        }

        // Create new provider
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'google_id' => $request->google_id,
            'avatar' => $request->avatar,
            'province' => $request->province,
            'city' => $request->city,
            'whatsapp_number' => $request->whatsapp_number,
            'role' => 'provider',
            'password' => Hash::make(uniqid()), // Random password since using Google
        ]);

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}
