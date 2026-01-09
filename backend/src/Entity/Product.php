<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ApiResource]
/**
 * Entité Product (Produit)
 * Représente un article en vente dans la boutique.
 * Cette classe est mappée à la base de données via Doctrine et exposée via API Platform.
 */
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    /** @var string|null $name Le nom du produit */
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    /** @var string|null $description Une description détaillée du produit */
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    /** @var float|null $price Le prix du produit en euros */
    private ?float $price = null;

    #[ORM\Column(length: 255, nullable: true)]
    /** @var string|null $imageUrl L'URL de l'image de présentation du produit */
    private ?string $imageUrl = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(?string $imageUrl): static
    {
        $this->imageUrl = $imageUrl;

        return $this;
    }
}
