<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\AppointmentRepository;
use App\State\AppointmentProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Entité Appointment (Rendez-vous)
 *
 * Représente un rendez-vous pris par un client pour une prestation.
 * Cette entité est automatiquement exposée en REST API via API Platform.
 *
 * Endpoints générés :
 * - GET    /api/appointments       : Liste tous les rendez-vous
 * - POST   /api/appointments       : Crée un nouveau rendez-vous
 * - GET    /api/appointments/{id}  : Récupère un rendez-vous spécifique
 * - PUT    /api/appointments/{id}  : Met à jour un rendez-vous
 * - DELETE /api/appointments/{id}  : Supprime un rendez-vous
 *
 * @author Nailyse Team
 * @package App\Entity
 */
#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(processor: AppointmentProcessor::class),
        new Patch(),
        new Delete()
    ]
)]
class Appointment
{
    /**
     * Identifiant unique du rendez-vous (clé primaire auto-incrémentée)
     * @var int|null
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Nom complet du client
     * Obligatoire, maximum 255 caractères
     * @var string|null
     */
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le nom du client est obligatoire.')]
    #[Assert\Length(
        min: 2,
        max: 255,
        minMessage: 'Le nom doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères.'
    )]
    private ?string $clientName = null;

    /**
     * Adresse email du client
     * Obligatoire, doit être une adresse email valide
     * @var string|null
     */
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'L\'email du client est obligatoire.')]
    #[Assert\Email(message: 'L\'adresse email "{{ value }}" n\'est pas valide.')]
    private ?string $clientEmail = null;

    /**
     * Numéro de téléphone du client
     * Optionnel, maximum 20 caractères
     * @var string|null
     */
    #[ORM\Column(length: 20, nullable: true)]
    #[Assert\Regex(
        pattern: '/^[0-9+\s\.\-\(\)]+$/',
        message: 'Le numéro de téléphone contient des caractères invalides.'
    )]
    private ?string $clientPhone = null;

    /**
     * Date et heure de début du rendez-vous
     * Obligatoire, immuable (DateTimeImmutable pour éviter les modifications accidentelles)
     * @var \DateTimeImmutable|null
     */
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Assert\NotNull(message: 'La date du rendez-vous est obligatoire.')]
    #[Assert\GreaterThan(
        value: 'now',
        message: 'La date du rendez-vous doit être dans le futur.'
    )]
    private ?\DateTimeImmutable $startAt = null;

    /**
     * Statut du rendez-vous
     * Valeurs possibles : PENDING (en attente), CONFIRMED (confirmé), CANCELLED (annulé)
     * Par défaut : PENDING
     * @var string|null
     */
    #[ORM\Column(length: 50)]
    #[Assert\Choice(
        choices: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        message: 'Le statut doit être PENDING, CONFIRMED ou CANCELLED.'
    )]
    private ?string $status = 'PENDING';

    /**
     * Retourne l'identifiant du rendez-vous
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Retourne le nom du client
     * @return string|null
     */
    public function getClientName(): ?string
    {
        return $this->clientName;
    }

    /**
     * Définit le nom du client
     * @param string $clientName
     * @return static
     */
    public function setClientName(string $clientName): static
    {
        $this->clientName = $clientName;

        return $this;
    }

    /**
     * Retourne l'email du client
     * @return string|null
     */
    public function getClientEmail(): ?string
    {
        return $this->clientEmail;
    }

    /**
     * Définit l'email du client
     * @param string $clientEmail
     * @return static
     */
    public function setClientEmail(string $clientEmail): static
    {
        $this->clientEmail = $clientEmail;

        return $this;
    }

    /**
     * Retourne la date et heure de début du rendez-vous
     * @return \DateTimeImmutable|null
     */
    public function getStartAt(): ?\DateTimeImmutable
    {
        return $this->startAt;
    }

    /**
     * Définit la date et heure de début du rendez-vous
     * @param \DateTimeImmutable $startAt
     * @return static
     */
    public function setStartAt(\DateTimeImmutable $startAt): static
    {
        $this->startAt = $startAt;

        return $this;
    }

    /**
     * Retourne le statut du rendez-vous
     * @return string|null
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * Définit le statut du rendez-vous
     * @param string $status Doit être 'PENDING', 'CONFIRMED' ou 'CANCELLED'
     * @return static
     */
    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Retourne le numéro de téléphone du client
     * @return string|null
     */
    public function getClientPhone(): ?string
    {
        return $this->clientPhone;
    }

    /**
     * Définit le numéro de téléphone du client
     * @param string|null $clientPhone
     * @return static
     */
    public function setClientPhone(?string $clientPhone): static
    {
        $this->clientPhone = $clientPhone;

        return $this;
    }
}
