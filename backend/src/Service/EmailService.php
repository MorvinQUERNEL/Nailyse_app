<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

/**
 * Email Service
 *
 * Handles all email communications for the Nailyse application.
 * Supports both French and English languages.
 */
class EmailService
{
    private const FROM_EMAIL = 'hello@demomailtrap.co';
    private const FROM_NAME = 'Nailyse';

    public function __construct(
        private MailerInterface $mailer
    ) {
    }

    /**
     * Send welcome email after registration
     */
    public function sendWelcomeEmail(User $user, string $language = 'fr'): void
    {
        $translations = $this->getTranslations($language);
        $html = $this->buildEmail(
            $translations['welcome']['subject'],
            $this->getWelcomeContent($user, $language),
            $language
        );

        $this->send($user->getEmail(), $translations['welcome']['subject'], $html);
    }

    /**
     * Send appointment confirmation email
     */
    public function sendAppointmentConfirmation(Appointment $appointment, string $language = 'fr'): void
    {
        $translations = $this->getTranslations($language);
        $html = $this->buildEmail(
            $translations['appointment']['subject'],
            $this->getAppointmentConfirmationContent($appointment, $language),
            $language
        );

        $this->send(
            $appointment->getClientEmail(),
            $translations['appointment']['subject'] . ' - Nailyse',
            $html
        );
    }

    /**
     * Send order confirmation email
     */
    public function sendOrderConfirmation(string $email, string $clientName, array $items, float $total, string $language = 'fr'): void
    {
        $translations = $this->getTranslations($language);
        $html = $this->buildEmail(
            $translations['order']['subject'],
            $this->getOrderConfirmationContent($clientName, $items, $total, $language),
            $language
        );

        $this->send($email, $translations['order']['subject'] . ' - Nailyse', $html);
    }

    /**
     * Send the email
     */
    private function send(string $to, string $subject, string $html): void
    {
        $email = (new Email())
            ->from(new Address(self::FROM_EMAIL, self::FROM_NAME))
            ->to($to)
            ->subject($subject)
            ->html($html);

        $this->mailer->send($email);
    }

    /**
     * Get translations for a given language
     */
    private function getTranslations(string $language): array
    {
        $translations = [
            'fr' => [
                'welcome' => [
                    'subject' => 'Bienvenue chez Nailyse',
                    'greeting' => 'Bienvenue',
                    'message' => 'Nous sommes ravis de vous accueillir dans l\'univers',
                    'accountCreated' => 'Votre compte a ete cree avec succes.',
                    'yourAccount' => 'Votre compte',
                    'discover' => 'Decouvrez notre collection de produits de qualite professionnelle et reservez votre prochain rendez-vous en quelques clics.',
                    'cta' => 'Decouvrir la boutique',
                    'seeYou' => 'A tres bientot dans notre salon !',
                ],
                'appointment' => [
                    'subject' => 'Confirmation de votre rendez-vous',
                    'title' => 'Rendez-vous confirme',
                    'greeting' => 'Bonjour',
                    'confirmed' => 'Votre rendez-vous chez Nailyse est confirme.',
                    'client' => 'Client',
                    'email' => 'Email',
                    'phone' => 'Telephone',
                    'important' => 'Important',
                    'cancelNotice' => 'En cas d\'empechement, merci de nous prevenir au moins 24h a l\'avance.',
                ],
                'order' => [
                    'subject' => 'Confirmation de votre commande',
                    'title' => 'Merci pour votre commande !',
                    'greeting' => 'Bonjour',
                    'received' => 'Nous avons bien recu votre commande et nous vous en remercions.',
                    'summary' => 'Recapitulatif de votre commande',
                    'quantity' => 'Quantite',
                    'total' => 'Total',
                    'shipping' => 'Votre commande sera preparee avec soin et expediee dans les plus brefs delais.',
                    'cta' => 'Continuer mes achats',
                ],
                'footer' => [
                    'followUs' => 'Suivez-nous',
                    'salonName' => 'Salon de beaute',
                    'rights' => 'Tous droits reserves.',
                ],
                'tagline' => 'L\'art de la beaute',
            ],
            'en' => [
                'welcome' => [
                    'subject' => 'Welcome to Nailyse',
                    'greeting' => 'Welcome',
                    'message' => 'We are delighted to welcome you to the',
                    'accountCreated' => 'Your account has been created successfully.',
                    'yourAccount' => 'Your account',
                    'discover' => 'Discover our collection of professional quality products and book your next appointment in just a few clicks.',
                    'cta' => 'Discover the shop',
                    'seeYou' => 'See you soon at our salon!',
                ],
                'appointment' => [
                    'subject' => 'Your appointment confirmation',
                    'title' => 'Appointment confirmed',
                    'greeting' => 'Hello',
                    'confirmed' => 'Your appointment at Nailyse is confirmed.',
                    'client' => 'Client',
                    'email' => 'Email',
                    'phone' => 'Phone',
                    'important' => 'Important',
                    'cancelNotice' => 'If you need to cancel, please let us know at least 24 hours in advance.',
                ],
                'order' => [
                    'subject' => 'Your order confirmation',
                    'title' => 'Thank you for your order!',
                    'greeting' => 'Hello',
                    'received' => 'We have received your order and thank you for your purchase.',
                    'summary' => 'Order summary',
                    'quantity' => 'Quantity',
                    'total' => 'Total',
                    'shipping' => 'Your order will be carefully prepared and shipped as soon as possible.',
                    'cta' => 'Continue shopping',
                ],
                'footer' => [
                    'followUs' => 'Follow us',
                    'salonName' => 'Beauty salon',
                    'rights' => 'All rights reserved.',
                ],
                'tagline' => 'The art of beauty',
            ],
        ];

        return $translations[$language] ?? $translations['fr'];
    }

    /**
     * Build email with base template
     */
    private function buildEmail(string $title, string $content, string $language = 'fr'): string
    {
        $t = $this->getTranslations($language);
        $htmlLang = $language === 'en' ? 'en' : 'fr';

        return <<<HTML
<!DOCTYPE html>
<html lang="{$htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 300; color: #722F37; letter-spacing: 4px; font-family: Georgia, serif;">
                                NAILYSE
                            </h1>
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #C9A87C; letter-spacing: 2px; text-transform: uppercase;">
                                {$t['tagline']}
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content Card -->
                    <tr>
                        <td>
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(26, 22, 20, 0.08);">
                                <!-- Decorative top border -->
                                <tr>
                                    <td style="height: 4px; background: linear-gradient(90deg, #722F37 0%, #C9A87C 50%, #722F37 100%);"></td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 40px 30px 40px;">
                                        {$content}
                                    </td>
                                </tr>

                                <!-- Decorative bottom border -->
                                <tr>
                                    <td style="height: 4px; background: linear-gradient(90deg, #722F37 0%, #C9A87C 50%, #722F37 100%);"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top: 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; font-size: 14px; color: #1A1614;">
                                {$t['footer']['followUs']}
                            </p>
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="padding: 0 8px;">
                                        <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #722F37; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: #FFFFFF; font-size: 14px;">in</a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                        <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #722F37; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: #FFFFFF; font-size: 14px;">ig</a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                        <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #722F37; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: #FFFFFF; font-size: 14px;">fb</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 20px 0 0 0; font-size: 12px; color: #888888; line-height: 1.6;">
                                Nailyse - {$t['footer']['salonName']}<br>
                                123 Avenue de la Beaute, 75001 Paris<br>
                                <a href="mailto:contact@nailyse.com" style="color: #C9A87C; text-decoration: none;">contact@nailyse.com</a>
                            </p>
                            <p style="margin: 15px 0 0 0; font-size: 11px; color: #AAAAAA;">
                                &copy; 2025 Nailyse. {$t['footer']['rights']}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    /**
     * Welcome email content
     */
    private function getWelcomeContent(User $user, string $language = 'fr'): string
    {
        $t = $this->getTranslations($language);
        $firstName = explode(' ', $user->getFullName())[0];

        return <<<HTML
<h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 400; color: #1A1614; font-family: Georgia, serif;">
    {$t['welcome']['greeting']} {$firstName},
</h2>

<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #4A4A4A;">
    {$t['welcome']['message']} <strong style="color: #722F37;">Nailyse</strong>.
    {$t['welcome']['accountCreated']}
</p>

<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #FAF7F2; border-radius: 6px;">
    <tr>
        <td style="padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">
                {$t['welcome']['yourAccount']}
            </p>
            <p style="margin: 0; font-size: 16px; color: #1A1614;">
                <strong>{$user->getEmail()}</strong>
            </p>
        </td>
    </tr>
</table>

<p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.7; color: #4A4A4A;">
    {$t['welcome']['discover']}
</p>

<table role="presentation" style="margin: 0 auto;">
    <tr>
        <td style="background-color: #722F37; border-radius: 4px;">
            <a href="http://localhost:5173/shop" style="display: inline-block; padding: 14px 30px; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                {$t['welcome']['cta']}
            </a>
        </td>
    </tr>
</table>

<p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; text-align: center;">
    {$t['welcome']['seeYou']}
</p>
HTML;
    }

    /**
     * Appointment confirmation content
     */
    private function getAppointmentConfirmationContent(Appointment $appointment, string $language = 'fr'): string
    {
        $t = $this->getTranslations($language);
        $date = $appointment->getStartAt()->format('d/m/Y');
        $time = $appointment->getStartAt()->format('H:i');
        $dayName = $this->getDayName($appointment->getStartAt(), $language);

        return <<<HTML
<h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 400; color: #1A1614; font-family: Georgia, serif;">
    {$t['appointment']['title']}
</h2>

<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #4A4A4A;">
    {$t['appointment']['greeting']} <strong>{$appointment->getClientName()}</strong>,<br>
    {$t['appointment']['confirmed']}
</p>

<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #FAF7F2; border-radius: 6px;">
    <tr>
        <td style="padding: 25px; text-align: center;">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #C9A87C; text-transform: uppercase; letter-spacing: 2px;">
                {$dayName}
            </p>
            <p style="margin: 0 0 5px 0; font-size: 32px; font-weight: 300; color: #722F37; font-family: Georgia, serif;">
                {$date}
            </p>
            <p style="margin: 0; font-size: 24px; color: #1A1614;">
                {$time}
            </p>
        </td>
    </tr>
</table>

<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #F5E6D3;">
            <table role="presentation" style="width: 100%;">
                <tr>
                    <td style="font-size: 14px; color: #888888; width: 100px;">{$t['appointment']['client']}</td>
                    <td style="font-size: 14px; color: #1A1614; text-align: right;">{$appointment->getClientName()}</td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #F5E6D3;">
            <table role="presentation" style="width: 100%;">
                <tr>
                    <td style="font-size: 14px; color: #888888; width: 100px;">{$t['appointment']['email']}</td>
                    <td style="font-size: 14px; color: #1A1614; text-align: right;">{$appointment->getClientEmail()}</td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 15px 0;">
            <table role="presentation" style="width: 100%;">
                <tr>
                    <td style="font-size: 14px; color: #888888; width: 100px;">{$t['appointment']['phone']}</td>
                    <td style="font-size: 14px; color: #1A1614; text-align: right;">{$appointment->getClientPhone()}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 25px 0 0 0; padding: 15px; background-color: #FFF8E7; border-left: 3px solid #C9A87C; font-size: 14px; color: #4A4A4A; line-height: 1.6;">
    <strong>{$t['appointment']['important']}:</strong> {$t['appointment']['cancelNotice']}
</p>
HTML;
    }

    /**
     * Order confirmation content
     */
    private function getOrderConfirmationContent(string $clientName, array $items, float $total, string $language = 'fr'): string
    {
        $t = $this->getTranslations($language);
        $itemsHtml = '';
        foreach ($items as $item) {
            $itemTotal = number_format($item['price'] * $item['quantity'], 2, ',', ' ');
            $itemsHtml .= <<<HTML
<tr>
    <td style="padding: 15px 0; border-bottom: 1px solid #F5E6D3;">
        <table role="presentation" style="width: 100%;">
            <tr>
                <td style="font-size: 14px; color: #1A1614;">
                    <strong>{$item['name']}</strong><br>
                    <span style="color: #888888;">{$t['order']['quantity']}: {$item['quantity']}</span>
                </td>
                <td style="font-size: 14px; color: #722F37; text-align: right; font-weight: 500;">
                    {$itemTotal} EUR
                </td>
            </tr>
        </table>
    </td>
</tr>
HTML;
        }

        $totalFormatted = number_format($total, 2, ',', ' ');

        return <<<HTML
<h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 400; color: #1A1614; font-family: Georgia, serif;">
    {$t['order']['title']}
</h2>

<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #4A4A4A;">
    {$t['order']['greeting']} <strong>{$clientName}</strong>,<br>
    {$t['order']['received']}
</p>

<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #FAF7F2; border-radius: 6px; overflow: hidden;">
    <tr>
        <td style="padding: 20px; background-color: #722F37;">
            <p style="margin: 0; font-size: 14px; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1px;">
                {$t['order']['summary']}
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding: 0 20px;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                {$itemsHtml}
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 20px; background-color: #F5E6D3;">
            <table role="presentation" style="width: 100%;">
                <tr>
                    <td style="font-size: 16px; color: #1A1614; font-weight: 500;">
                        {$t['order']['total']}
                    </td>
                    <td style="font-size: 20px; color: #722F37; text-align: right; font-weight: 600;">
                        {$totalFormatted} EUR
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.7; color: #4A4A4A;">
    {$t['order']['shipping']}
</p>

<table role="presentation" style="margin: 0 auto;">
    <tr>
        <td style="background-color: #722F37; border-radius: 4px;">
            <a href="http://localhost:5173/shop" style="display: inline-block; padding: 14px 30px; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                {$t['order']['cta']}
            </a>
        </td>
    </tr>
</table>
HTML;
    }

    /**
     * Get day name in the specified language
     */
    private function getDayName(\DateTimeImmutable $date, string $language = 'fr'): string
    {
        $days = [
            'fr' => [
                'Sunday' => 'Dimanche',
                'Monday' => 'Lundi',
                'Tuesday' => 'Mardi',
                'Wednesday' => 'Mercredi',
                'Thursday' => 'Jeudi',
                'Friday' => 'Vendredi',
                'Saturday' => 'Samedi',
            ],
            'en' => [
                'Sunday' => 'Sunday',
                'Monday' => 'Monday',
                'Tuesday' => 'Tuesday',
                'Wednesday' => 'Wednesday',
                'Thursday' => 'Thursday',
                'Friday' => 'Friday',
                'Saturday' => 'Saturday',
            ],
        ];

        $langDays = $days[$language] ?? $days['fr'];
        return $langDays[$date->format('l')] ?? '';
    }
}
