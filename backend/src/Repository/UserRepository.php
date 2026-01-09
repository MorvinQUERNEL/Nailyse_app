<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * UserRepository
 *
 * Repository for managing User entities in the database.
 * Extends ServiceEntityRepository for database operations.
 * Implements PasswordUpgraderInterface for automatic password rehashing.
 *
 * @extends ServiceEntityRepository<User>
 * @author Nailyse Team
 * @package App\Repository
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    /**
     * Constructor
     *
     * @param ManagerRegistry $registry Doctrine manager registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Save a user entity to the database
     *
     * @param User $entity The user entity to save
     * @param bool $flush Whether to flush changes immediately (default: false)
     * @return void
     */
    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Remove a user entity from the database
     *
     * @param User $entity The user entity to remove
     * @param bool $flush Whether to flush changes immediately (default: false)
     * @return void
     */
    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     * This is called automatically by Symfony when a stronger algorithm becomes available.
     *
     * @param PasswordAuthenticatedUserInterface $user The user whose password needs upgrading
     * @param string $newHashedPassword The new hashed password
     * @return void
     * @throws UnsupportedUserException If the user class is not supported
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->save($user, true);
    }

    /**
     * Find a user by email address
     *
     * @param string $email The email address to search for
     * @return User|null The user if found, null otherwise
     */
    public function findOneByEmail(string $email): ?User
    {
        return $this->findOneBy(['email' => $email]);
    }

    /**
     * Find all active users
     *
     * @return User[] Array of active users
     */
    public function findActiveUsers(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('u.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find all admin users
     *
     * @return User[] Array of admin users
     */
    public function findAdmins(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('JSON_CONTAINS(u.roles, :role) = 1')
            ->setParameter('role', '"ROLE_ADMIN"')
            ->orderBy('u.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Count total number of users
     *
     * @return int Total user count
     */
    public function countAll(): int
    {
        return $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Count active users
     *
     * @return int Active user count
     */
    public function countActive(): int
    {
        return $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->andWhere('u.isActive = :active')
            ->setParameter('active', true)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
