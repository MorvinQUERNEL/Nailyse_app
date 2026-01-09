<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

/**
 * Authentication Success Handler
 *
 * Handles successful authentication and returns a JSON response with user data and token.
 * Called after a user successfully logs in via the JSON login authenticator.
 *
 * @author Nailyse Team
 * @package App\Security
 */
class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    /**
     * Handle successful authentication
     * Generates an API token and returns user information
     *
     * @param Request $request The login request
     * @param TokenInterface $token The authentication token containing user data
     * @return JsonResponse JSON response with user data and API token
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        $user = $token->getUser();

        // Generate API token for the user
        // IMPORTANT: This is a simplified implementation
        // In production, use proper JWT tokens with lexik/jwt-authentication-bundle
        $apiToken = $this->generateToken($user->getUserIdentifier());

        return new JsonResponse([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'fullName' => $user->getFullName(),
                'roles' => $user->getRoles(),
                'isAdmin' => $user->isAdmin(),
            ],
            'token' => $apiToken,
        ]);
    }

    /**
     * Generate a simple API token for the user
     *
     * IMPORTANT: This is a basic implementation for demonstration
     * Production applications should use JWT tokens with:
     * - Digital signatures (RS256/HS256)
     * - Expiration timestamps
     * - Refresh tokens
     * - Token blacklisting
     *
     * Recommended package: lexik/jwt-authentication-bundle
     *
     * @param string $email User's email identifier
     * @return string Base64-encoded token
     */
    private function generateToken(string $email): string
    {
        // Simple token format: base64(email:timestamp)
        // In production, use JWT with proper signing
        $timestamp = time();
        $tokenData = sprintf('%s:%d', $email, $timestamp);

        return base64_encode($tokenData);
    }
}
