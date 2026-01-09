<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

/**
 * API Token Authenticator
 *
 * Handles authentication for API requests using Bearer tokens.
 * Tokens are sent in the Authorization header as: "Bearer {token}"
 *
 * This is a simplified token authenticator. In production, consider using:
 * - JWT tokens with lexik/jwt-authentication-bundle
 * - OAuth2 with league/oauth2-server-bundle
 *
 * @author Nailyse Team
 * @package App\Security
 */
class ApiTokenAuthenticator extends AbstractAuthenticator
{
    /**
     * Constructor
     *
     * @param UserRepository $userRepository Repository to load users
     */
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    /**
     * Check if this authenticator should be used for this request
     * Only applies to /api routes with Authorization header
     *
     * @param Request $request The current request
     * @return bool|null True if this authenticator should handle the request
     */
    public function supports(Request $request): ?bool
    {
        // Only authenticate API routes with Authorization header
        return str_starts_with($request->getPathInfo(), '/api')
            && $request->headers->has('Authorization');
    }

    /**
     * Extract and validate the authentication credentials
     * Creates a passport with user information
     *
     * @param Request $request The current request
     * @return Passport The authentication passport
     * @throws CustomUserMessageAuthenticationException If token is invalid
     */
    public function authenticate(Request $request): Passport
    {
        $authorizationHeader = $request->headers->get('Authorization');

        // Extract token from "Bearer {token}" format
        if (!preg_match('/^Bearer\s+(.*)$/i', $authorizationHeader, $matches)) {
            throw new CustomUserMessageAuthenticationException('Format de token invalide. Utilisez: Bearer {token}');
        }

        $token = $matches[1];

        if (empty($token)) {
            throw new CustomUserMessageAuthenticationException('Token manquant');
        }

        // Validate token format (simple email-based token for demo)
        // In production, use JWT or proper token validation
        $email = $this->validateToken($token);

        if (!$email) {
            throw new CustomUserMessageAuthenticationException('Token invalide ou expiré');
        }

        // Return a self-validating passport with user identifier
        return new SelfValidatingPassport(
            new UserBadge($email, function ($userIdentifier) {
                $user = $this->userRepository->findOneByEmail($userIdentifier);

                if (!$user) {
                    throw new CustomUserMessageAuthenticationException('Utilisateur non trouvé');
                }

                if (!$user->isActive()) {
                    throw new CustomUserMessageAuthenticationException('Compte désactivé');
                }

                return $user;
            })
        );
    }

    /**
     * Called when authentication is successful
     * For stateless APIs, we don't need to do anything here
     *
     * @param Request $request The current request
     * @param TokenInterface $token The authentication token
     * @param string $firewallName The firewall name
     * @return Response|null Null to continue the request
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Allow the request to continue
        return null;
    }

    /**
     * Called when authentication fails
     * Returns a JSON error response
     *
     * @param Request $request The current request
     * @param AuthenticationException $exception The authentication exception
     * @return JsonResponse JSON error response
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse([
            'error' => 'Authentication échouée',
            'message' => $exception->getMessageKey()
        ], Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Validate the API token and extract user email
     *
     * IMPORTANT: This is a simplified implementation for demonstration
     * In production, use proper JWT validation with:
     * - Signature verification
     * - Expiration checking
     * - Issuer validation
     *
     * @param string $token The token to validate
     * @return string|null The user email if valid, null otherwise
     */
    private function validateToken(string $token): ?string
    {
        // Simple base64 token format: base64(email:timestamp)
        // Production should use JWT (lexik/jwt-authentication-bundle)

        $decoded = base64_decode($token, true);

        if (!$decoded || !str_contains($decoded, ':')) {
            return null;
        }

        [$email, $timestamp] = explode(':', $decoded, 2);

        // Check if token is expired (24 hours)
        $expirationTime = 86400; // 24 hours in seconds
        if ((time() - (int)$timestamp) > $expirationTime) {
            return null;
        }

        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }
}
