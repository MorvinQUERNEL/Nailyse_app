<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Security Controller
 *
 * Handles authentication endpoints for the API.
 * The actual authentication logic is handled by Symfony's security component.
 */
class SecurityController extends AbstractController
{
    /**
     * Login endpoint
     *
     * This route is handled by the json_login authenticator configured in security.yaml.
     * The method body is never executed - Symfony intercepts the request.
     */
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // This code is never reached - the json_login authenticator handles authentication
        // and returns a response via AuthenticationSuccessHandler or AuthenticationFailureHandler
        return new JsonResponse(['error' => 'Configuration error'], 500);
    }
}
