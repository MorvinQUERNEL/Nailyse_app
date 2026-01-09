<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Appointment;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Appointment State Processor
 *
 * Handles appointment creation and sends confirmation emails.
 */
class AppointmentProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EmailService $emailService,
        private RequestStack $requestStack
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Appointment
    {
        // Get language from request
        $language = 'fr';
        $request = $this->requestStack->getCurrentRequest();
        if ($request) {
            $content = json_decode($request->getContent(), true);
            $language = $content['language'] ?? 'fr';
        }

        // Persist the appointment
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        // Send confirmation email only for new appointments (POST)
        if ($operation instanceof Post && $data instanceof Appointment) {
            try {
                $this->emailService->sendAppointmentConfirmation($data, $language);
            } catch (\Exception $e) {
                // Log error but don't fail the request
                // The appointment was already saved
            }
        }

        return $data;
    }
}
