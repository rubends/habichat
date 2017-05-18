<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="invite")
 */
class Invite
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * 
     * @ORM\Column(type="integer")
     */
    protected $inviter;

    /**
     * @ORM\Column(type="integer")
     */
    protected $flat;

    /**
     * @ORM\Column(type="string")
     */
    protected $recipient;

    /**
     * @ORM\Column(type="string")
     */
    protected $inviteKey;

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
     * @return int
     *
     */
    public function getInviter()
    {
        return $this->inviter;
    }

    /**
     * @param int $inviter
     */
    public function setInviter($inviter)
    {
        $this->inviter = $inviter;
    }

    /**
     * @return int
     *
     */
    public function getFlat()
    {
        return $this->flat;
    }

    /**
     * @param int $flat
     */
    public function setFlat($flat)
    {
        $this->flat = $flat;
    }

    /**
     * @return string
     *
     */
    public function getRecipient()
    {
        return $this->recipient;
    }

    /**
     * @param string $recipient
     */
    public function setRecipient($recipient)
    {
        $this->recipient = $recipient;
    }

    /**
     * @return string
     *
     */
    public function getInviteKey()
    {
        return $this->inviteKey;
    }

    /**
     * @param string $inviteKey
     */
    public function setInviteKey($inviteKey)
    {
        $this->inviteKey = $inviteKey;
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