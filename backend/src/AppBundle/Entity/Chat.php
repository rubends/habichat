<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="chat")
 */
class Chat
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    protected $id;

    /**
     * 
     * @ORM\Column(type="string")
     *
     * @var string
     */
    protected $text;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="chats")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $send;

    /**
     * @ORM\ManyToOne(targetEntity="Flat", inversedBy="chats")
     * @ORM\JoinColumn(name="flat_id", referencedColumnName="id")
     */
    protected $flat;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     *
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
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
     * @param User $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return datetime
     *
     */
    public function getSend()
    {
        return $this->send;
    }

    /**
     * @param datetime $send
     */
    public function setSend($send)
    {
        $this->send = $send;
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
     * @param Flat $flat
     */
    public function setFlat($flat)
    {
        $this->flat = $flat;
    }

}