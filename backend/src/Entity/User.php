<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * User Entity
 *
 * Represents a user in the Nailyse application system.
 * This entity implements Symfony's security interfaces for authentication.
 *
 * Security Roles:
 * - ROLE_USER: Standard authenticated user (can book appointments, shop)
 * - ROLE_ADMIN: Administrator with full access to manage the system
 *
 * @author Nailyse Team
 * @package App\Entity
 */
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['email'], message: 'Un compte existe déjà avec cet email.')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['user:list']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Get(
            normalizationContext: ['groups' => ['user:read']],
            security: "is_granted('ROLE_ADMIN') or object == user"
        ),
        new Post(
            denormalizationContext: ['groups' => ['user:create']],
            security: "is_granted('PUBLIC_ACCESS')"
        ),
        new Put(
            denormalizationContext: ['groups' => ['user:update']],
            security: "is_granted('ROLE_ADMIN') or object == user"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        ),
    ]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * Unique identifier for the user
     * Auto-incremented primary key
     *
     * @var int|null
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['user:list', 'user:read'])]
    private ?int $id = null;

    /**
     * User's email address (also serves as username/identifier)
     * Must be unique across all users
     * Used for authentication and communication
     *
     * @var string|null
     */
    #[ORM\Column(type: 'string', length: 180, unique: true)]
    #[Assert\NotBlank(message: 'L\'email est obligatoire.')]
    #[Assert\Email(message: 'L\'adresse email "{{ value }}" n\'est pas valide.')]
    #[Groups(['user:list', 'user:read', 'user:create', 'user:update'])]
    private ?string $email = null;

    /**
     * User's full name
     *
     * @var string|null
     */
    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
    #[Assert\Length(
        min: 2,
        max: 255,
        minMessage: 'Le nom doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères.'
    )]
    #[Groups(['user:list', 'user:read', 'user:create', 'user:update'])]
    private ?string $fullName = null;

    /**
     * User's phone number (optional)
     *
     * @var string|null
     */
    #[ORM\Column(type: 'string', length: 20, nullable: true)]
    #[Assert\Regex(
        pattern: '/^[0-9+\s\.\-\(\)]+$/',
        message: 'Le numéro de téléphone contient des caractères invalides.'
    )]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private ?string $phone = null;

    /**
     * User roles array
     * Determines user permissions in the application
     * Every user automatically gets ROLE_USER
     *
     * Possible roles:
     * - ROLE_USER: Standard user access
     * - ROLE_ADMIN: Full administrative access
     *
     * @var array<string>
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['user:read'])]
    private array $roles = [];

    /**
     * Hashed password
     * Never exposed in API responses for security
     *
     * @var string
     */
    #[ORM\Column(type: 'string')]
    private string $password = '';

    /**
     * Plain password field (not persisted to database)
     * Used only during registration/password change
     * Automatically hashed before storage
     *
     * @var string|null
     */
    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.', groups: ['user:create'])]
    #[Assert\Length(
        min: 8,
        minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.',
        groups: ['user:create', 'user:update']
    )]
    #[Groups(['user:create', 'user:update'])]
    private ?string $plainPassword = null;

    /**
     * Account creation timestamp
     * Automatically set when user is created
     *
     * @var \DateTimeImmutable|null
     */
    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['user:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * Account active status
     * Allows disabling accounts without deletion
     *
     * @var bool
     */
    #[ORM\Column(type: 'boolean')]
    #[Groups(['user:read', 'user:update'])]
    private bool $isActive = true;

    /**
     * Constructor
     * Initializes createdAt timestamp
     */
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // ========== Getters and Setters ==========

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getFullName(): ?string
    {
        return $this->fullName;
    }

    public function setFullName(string $fullName): self
    {
        $this->fullName = $fullName;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * Get the user identifier (email in this case)
     * Required by UserInterface
     *
     * @see UserInterface
     * @return string The unique identifier (email)
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * Get user roles
     * Automatically adds ROLE_USER if not present
     *
     * @see UserInterface
     * @return array<string> Array of role strings
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // Guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * Set user roles
     *
     * @param array<string> $roles Array of role strings
     * @return self
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * Get the hashed password
     * Required by PasswordAuthenticatedUserInterface
     *
     * @see PasswordAuthenticatedUserInterface
     * @return string The hashed password
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * Set the hashed password
     * Should only be called with already-hashed passwords
     *
     * @param string $password The hashed password
     * @return self
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * Get the plain (unhashed) password
     * Only used during registration/password changes
     *
     * @return string|null
     */
    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    /**
     * Set the plain password
     * This will be hashed before being stored
     *
     * @param string|null $plainPassword
     * @return self
     */
    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;
        return $this;
    }

    /**
     * Erase sensitive data (plain password)
     * Called by Symfony after authentication
     * Required by UserInterface
     *
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    /**
     * Check if user has admin role
     * Convenience method for role checking
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return in_array('ROLE_ADMIN', $this->roles, true);
    }
}
