<?php
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 * @UniqueEntity(fields="email", message="This email address is already in use")
 *
 * @Serializer\ExclusionPolicy("all")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id;
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Serializer\Expose
     * @Serializer\Groups({"User"})
     */
    protected $email;

    /**
     * @ORM\Column(type="string", length=40)
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $username;

    /**
     * @ORM\Column(type="string", length=50)
     * @Serializer\Expose
     * @Serializer\Groups({"User", "Flat"})
     */
    protected $role;

    /**
     * 
     * @ORM\ManyToOne(targetEntity="Flat", inversedBy="users", cascade={"persist"})
     * @ORM\JoinColumn(name="flat_id", referencedColumnName="id")
     * @Serializer\Expose
     * @Serializer\Groups({"User"})
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

    /*
    * @ORM\OneToMany(targetEntity="Invite", mappedBy="inviter")
    */
    protected $invite;

     /**
     * @ORM\ManyToMany(targetEntity="Bill", mappedBy="unpaidUsers")
     */
    protected $bills;

    /**
     * @ORM\ManyToMany(targetEntity="Bill", mappedBy="paidUsers")
     */
    protected $paid;

    /**
     * @ORM\ManyToMany(targetEntity="PollOption", mappedBy="voters")
     */
    protected $pollOptions;

    /*
    * @ORM\OneToMany(targetEntity="Widget", mappedBy="user")
    */
    protected $chores;

    /*
    * @ORM\OneToMany(targetEntity="Reset", mappedBy="user")
    */
    protected $reset;

    /*
    * @ORM\OneToMany(targetEntity="Chat", mappedBy="user")
    */
    protected $chats;

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

    /**
     * @return invite
     */
    public function getInvite()
    {
        return $this->invite;
    }

    /**
     * @param $invite
     */
    public function setInvite($invite)
    {
        $this->invite = $invite;
    }

    /**
     * @return bills
     */
    public function getBills()
    {
        return $this->bills;
    }

    /**
     * @param $bills
     */
    public function setBills($bills)
    {
        $this->bills = $bills;
    }

    public function addBill(Bill $bill)
    {
        $this->bills[] = $bill;
    }

    /**
     * @return paid
     */
    public function getPaid()
    {
        return $this->paid;
    }

    /**
     * @param $paid
     */
    public function setPaid($paid)
    {
        $this->paid = $paid;
    }

    public function addPaid(Bill $bill)
    {
        $this->paid[] = $bill;
    }

    /**
     * @return pollOptions
     */
    public function getPollOptions()
    {
        return $this->pollOptions;
    }

    /**
     * @param $pollOptions
     */
    public function setPollOptions($pollOptions)
    {
        $this->pollOptions = $pollOptions;
    }

    public function addPollOption(PollOption $pollOption)
    {
        $this->pollOptions[] = $pollOption;
    }

    /**
     * @return widget
     *
     */
    public function getWidget()
    {
        return $this->widget;
    }

    /**
     * @param $widget
     */
    public function setWidget($widget)
    {
        $this->widget = $widget;
    }


    /**
     * @return chores
     *
     */
    public function getChores()
    {
        return $this->chores;
    }

    /**
     * @param $chores
     */
    public function setChores($chores)
    {
        $this->chores = $chores;
    }

     /**
     * @return chats
     *
     */
    public function getChats()
    {
        return $this->chats;
    }

    /**
     * @param $chats
     */
    public function setChats($chats)
    {
        $this->chats = $chats;
    }


}