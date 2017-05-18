<?php
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 * @UniqueEntity(fields="email", message="This email address is already in use")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id;
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     */
    protected $email;

    /**
     * @ORM\Column(type="string", length=40)
     */
    protected $username;

    /**
     * @ORM\Column(type="string", length=50)
     */
    protected $role;

    /**
     * 
     * @ORM\ManyToOne(targetEntity="Flat", inversedBy="users")
     * @ORM\JoinColumn(name="flat_id", referencedColumnName="id", nullable=true)
     *
     */
    protected $flat;

    /**
     * @ORM\Column(type="string", length=64)
     */
    protected $password;

    /*
    * @ORM\OneToMany(targetEntity="Widget", mappedBy="user")
    */
    protected $widget;

    public function eraseCredentials()
    {
        return null;
    }

    /**
     * @return string
     *
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * @param string $role
     */
    public function setRole($role = null)
    {
        $this->role = $role;
    }

    public function getRoles()
    {
        return [$this->getRole()];
    }

    /**
     * @return int
     *
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }

    /**
     * @return string
     *
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @return string
     *
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return flat
     *
     */
    public function getFlat()
    {
        return $this->flat;
    }

    /**
     * @param $flat
     */
    public function setFlat($flat)
    {
        $this->flat = $flat;
    }

    /**
     * @return string
     *
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    // public function getPlainPassword()
    // {
    //     return $this->plainPassword;
    // }

    // public function setPlainPassword($plainPassword)
    // {
    //     $this->plainPassword = $plainPassword;
    // }
    public function getSalt()
    {
        return null;
    }

}