<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Registration Controller
 *
 * Handles user registration (account creation) for the Nailyse application.
 * Validates user input, hashes passwords, and creates new user accounts.
 *
 * @author Nailyse Team
 * @package App\Controller
 */
class RegistrationController extends AbstractController
{
    /**
     * Constructor
     *
     * @param UserPasswordHasherInterface $passwordHasher Service to hash passwords securely
     * @param ValidatorInterface $validator Service to validate entity constraints
     * @param EntityManagerInterface $entityManager Doctrine entity manager
     * @param UserRepository $userRepository Repository to check existing users
     */
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private EmailService $emailService
    ) {
    }

    /**
     * Register a new user account
     *
     * Expected JSON payload:
     * {
     *   "email": "user@example.com",
     *   "fullName": "John Doe",
     *   "phone": "+33612345678",
     *   "password": "securePassword123"
     * }
     *
     * @param Request $request The HTTP request containing user data
     * @return JsonResponse JSON response with success/error message
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        // Decode JSON request body
        $data = json_decode($request->getContent(), true);

        // Validate required fields
        if (!isset($data['email'], $data['fullName'], $data['password'])) {
            return $this->json([
                'success' => false,
                'error' => 'Données manquantes',
                'message' => 'Les champs email, fullName et password sont obligatoires.'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if user already exists
        $existingUser = $this->userRepository->findOneByEmail($data['email']);
        if ($existingUser) {
            return $this->json([
                'success' => false,
                'error' => 'Email déjà utilisé',
                'message' => 'Un compte existe déjà avec cet email.'
            ], Response::HTTP_CONFLICT);
        }

        // Create new user entity
        $user = new User();
        $user->setEmail($data['email']);
        $user->setFullName($data['fullName']);

        // Set optional phone number
        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
        }

        // Hash the plain password
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        // Set default role (ROLE_USER)
        $user->setRoles(['ROLE_USER']);

        // Validate the user entity
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json([
                'success' => false,
                'error' => 'Validation échouée',
                'errors' => $errorMessages
            ], Response::HTTP_BAD_REQUEST);
        }

        // Persist user to database
        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Send welcome email
            $this->emailService->sendWelcomeEmail($user);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Erreur serveur',
                'message' => 'Impossible de créer le compte. Veuillez réessayer.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Generate token for automatic login after registration
        $token = $this->generateToken($user->getEmail());

        return $this->json([
            'success' => true,
            'message' => 'Compte créé avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'fullName' => $user->getFullName(),
                'roles' => $user->getRoles(),
                'isAdmin' => $user->isAdmin(),
            ],
            'token' => $token,
        ], Response::HTTP_CREATED);
    }

    /**
     * Generate a simple API token for automatic login
     *
     * @param string $email User's email identifier
     * @return string Base64-encoded token
     */
    private function generateToken(string $email): string
    {
        $timestamp = time();
        $tokenData = sprintf('%s:%d', $email, $timestamp);
        return base64_encode($tokenData);
    }
}
