<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Application Fixtures
 *
 * Loads sample data into the database for development and testing.
 * Creates demo products and default admin/user accounts.
 *
 * Usage: php bin/console doctrine:fixtures:load
 *
 * @author Nailyse Team
 * @package App\DataFixtures
 */
class AppFixtures extends Fixture
{
    /**
     * Constructor
     *
     * @param UserPasswordHasherInterface $passwordHasher Service to hash passwords securely
     */
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    /**
     * Load fixtures into the database
     *
     * @param ObjectManager $manager Doctrine object manager
     * @return void
     */
    public function load(ObjectManager $manager): void
    {
        // ========== Create Users ==========
        $this->loadUsers($manager);

        // ========== Create Products ==========
        $this->loadProducts($manager);

        $manager->flush();
    }

    /**
     * Load demo users (admin and regular user)
     *
     * @param ObjectManager $manager Doctrine object manager
     * @return void
     */
    private function loadUsers(ObjectManager $manager): void
    {
        // Admin user
        $admin = new User();
        $admin->setEmail('admin@nailyse.com');
        $admin->setFullName('Admin Nailyse');
        $admin->setPhone('+33612345678');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword(
            $this->passwordHasher->hashPassword($admin, 'admin123')
        );
        $manager->persist($admin);

        // Regular user
        $user = new User();
        $user->setEmail('user@nailyse.com');
        $user->setFullName('Marie Dubois');
        $user->setPhone('+33698765432');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, 'user123')
        );
        $manager->persist($user);
    }

    /**
     * Load demo products
     *
     * @param ObjectManager $manager Doctrine object manager
     * @return void
     */
    private function loadProducts(ObjectManager $manager): void
    {
        $products = [
            [
                'name' => 'Vernis Gel UV - Rouge Passion',
                'description' => 'Un rouge intense pour une manucure longue durée. Finition brillante.',
                'price' => 12.99,
                'image' => 'https://images.unsplash.com/photo-1585128792020-803d29415281?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'name' => 'Lampe UV LED Pro',
                'description' => 'Séchage rapide pour tous types de gels. Minuterie automatique.',
                'price' => 45.50,
                'image' => 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            [
                'name' => 'Kit Manucure Complet',
                'description' => 'Tout le nécessaire pour démarrer : limes, repousse cuticules, huile nourrissante.',
                'price' => 29.99,
                'image' => 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            [
                'name' => 'Poudre Acrylique Rose',
                'description' => 'Pour des extensions solides et naturelles. Facile à travailler.',
                'price' => 15.00,
                'image' => 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'name' => 'Kit Press-on Nails "Glazed Donut"',
                'description' => 'Tendance Hailey Bieber, effet perlé blanc. Forme Amande. Inclus : 24 faux ongles, colle, lime.',
                'price' => 18.90,
                'image' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'name' => 'Kit Press-on Nails "Midnight Sparkle"',
                'description' => 'Noir profond avec paillettes holographiques. Forme Stiletto. Parfait pour les soirées.',
                'price' => 22.00,
                'image' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'name' => 'Kit Press-on Nails "Classic French"',
                'description' => 'L\'indémodable French Manucure. Forme Carrée arrondie. Élégance naturelle.',
                'price' => 16.50,
                'image' => 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop'
            ]
        ];

        foreach ($products as $p) {
            $product = new Product();
            $product->setName($p['name']);
            $product->setDescription($p['description']);
            $product->setPrice($p['price']);
            $product->setImageUrl($p['image']);
            $manager->persist($product);
        }

        $manager->flush();
    }
}
