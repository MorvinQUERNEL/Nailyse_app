<?php

namespace App\Controller;

use App\Service\EmailService;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class PaymentController extends AbstractController
{
    public function __construct(
        private EmailService $emailService
    ) {
    }
    /**
     * Crée une session de paiement Stripe.
     *
     * Cette méthode reçoit les articles du panier depuis le frontend,
     * calcule le montant total et génère une URL de redirection vers Stripe Checkout.
     *
     * @Route("/api/payment/create-session", name="api_payment_create_session", methods={"POST"})
     *
     * @param Request $request La requête HTTP contenant les données du panier (JSON).
     * @return JsonResponse Retourne l'URL de la session Stripe ou une erreur.
     */
    #[Route('/api/payment/create-session', name: 'api_payment_create_session', methods: ['POST'])]
    public function createSession(Request $request): JsonResponse
    {
        // Décodage du JSON envoyer par le frontend
        $data = json_decode($request->getContent(), true);
        $cartItems = $data['items'] ?? [];

        // Vérification si le panier est vide
        if (empty($cartItems)) {
            return new JsonResponse(['error' => 'Cart is empty'], 400);
        }

        // Récupération de la clé secrète Stripe depuis les variables d'environnement
        // En production, assurez-vous que cette clé est bien définie dans le fichier .env
        $stripeSecret = $_ENV['STRIPE_SECRET_KEY'];

        // Mode développement : Si la clé ressemble à un placeholder ou est absente, on simule une réponse
        // Cela permet de tester le frontend sans planter si Stripe n'est pas configuré
        if (str_starts_with($stripeSecret, 'sk_test_***')) {
            // Mock pour le développement local si pas de clé valide
            return new JsonResponse([
                'url' => 'http://localhost:5173/payment/success?session_id=mock_session_123'
            ]);
        }

        // Configuration de l'API Stripe avec la clé secrète
        Stripe::setApiKey($stripeSecret);

        // Préparation des articles pour Stripe (Line Items)
        $lineItems = [];
        foreach ($cartItems as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $item['name'],
                    ],
                    // Stripe attend le montant en centimes (ex: 10.00€ -> 1000)
                    'unit_amount' => (int) ($item['price'] * 100),
                ],
                'quantity' => $item['quantity'],
            ];
        }

        try {
            // Création de la session Stripe Checkout
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                // URLs de redirection après paiement (succès ou annulation)
                'success_url' => 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:5173/payment/cancel',
            ]);

            // Renvoie l'URL de paiement au frontend pour redirection
            return new JsonResponse(['url' => $session->url]);
        } catch (\Exception $e) {
            // Gestion des erreurs Stripe (clé invalide, erreur réseau, etc.)
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Confirme le paiement et envoie l'email de confirmation.
     *
     * Cette méthode est appelée par le frontend après un paiement réussi
     * pour envoyer l'email de confirmation au client.
     */
    #[Route('/api/payment/confirm', name: 'api_payment_confirm', methods: ['POST'])]
    public function confirmPayment(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $sessionId = $data['sessionId'] ?? null;
        $email = $data['email'] ?? null;
        $clientName = $data['clientName'] ?? 'Client';
        $items = $data['items'] ?? [];
        $language = $data['language'] ?? 'fr';

        if (!$email || empty($items)) {
            return new JsonResponse(['error' => 'Missing required data'], 400);
        }

        // Calculate total
        $total = 0;
        foreach ($items as $item) {
            $total += ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
        }

        try {
            // Send order confirmation email with language support
            $this->emailService->sendOrderConfirmation($email, $clientName, $items, $total, $language);

            return new JsonResponse([
                'success' => true,
                'message' => $language === 'en' ? 'Confirmation email sent' : 'Email de confirmation envoyé'
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => $language === 'en' ? 'Error sending email' : 'Erreur lors de l\'envoi de l\'email'
            ], 500);
        }
    }
}
