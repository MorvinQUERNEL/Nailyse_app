<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

/**
 * Authentication Failure Handler
 *
 * Handles failed authentication attempts and returns appropriate JSON error responses.
 * Called when a user fails to log in via the JSON login authenticator.
 *
 * @author Nailyse Team
 * @package App\Security
 */
class AuthenticationFailureHandler implements AuthenticationFailureHandlerInterface
{
    /**
     * Handle failed authentication
     * Returns a JSON response with error details
     *
     * @param Request $request The login request
     * @param AuthenticationException $exception The exception that caused the failure
     * @return JsonResponse JSON error response
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        // Get user-friendly error message
        $errorMessage = $this->getErrorMessage($exception);

        return new JsonResponse([
            'success' => false,
            'error' => 'Échec de l\'authentification',
            'message' => $errorMessage,
        ], Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Convert technical authentication exception to user-friendly message
     *
     * @param AuthenticationException $exception The authentication exception
     * @return string User-friendly error message in French
     */
    private function getErrorMessage(AuthenticationException $exception): string
    {
        $messageKey = $exception->getMessageKey();

        // Map technical error messages to user-friendly French messages
        return match ($messageKey) {
            'Invalid credentials.' => 'Email ou mot de passe incorrect.',
            'User account is disabled.' => 'Ce compte est désactivé.',
            'User account is locked.' => 'Ce compte est verrouillé.',
            'User account has expired.' => 'Ce compte a expiré.',
            'Credentials have expired.' => 'Vos identifiants ont expiré.',
            default => 'Identifiants invalides. Veuillez réessayer.',
        };
    }
}
