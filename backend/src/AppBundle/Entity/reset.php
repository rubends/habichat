<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="reset")
 */
class Reset
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="reset")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

    /**
     * @ORM\Column(type="string")
     */
    protected $resetKey;

    /**
     * @ORM\Column(type="date")
     */
    protected $sendDate;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return user
     *
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param user $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return string
     *
     */
    public function getResetKey()
    {
        return $this->resetKey;
    }

    /**
     * @param string $resetKey
     */
    public function setResetKey($resetKey)
    {
        $this->resetKey = $resetKey;
    }

    /**
     * @return date
     *
     */
    public function getSendDate()
    {
        return $this->sendDate;
    }

    /**
     * @param date $sendDate
     */
    public function setSendDate($sendDate)
    {
        $this->sendDate = $sendDate;
    }
}