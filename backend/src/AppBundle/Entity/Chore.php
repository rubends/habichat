<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="chore")
 */
class Chore
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
     * @ORM\Column(type="string")
     *
     * @var string
     */
    protected $title;

    /**
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    protected $occurance;

    /**
     * @ORM\Column(type="datetime")
     *
     * @var datetime
     */
    protected $last;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="chores")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

    /**
     * @ORM\Column(type="integer")
     * @var int
     */
    protected $widget;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param int $occurance
     */
    public function setOccurance($occurance)
    {
        $this->occurance = $occurance;
    }

    /**
     * @return int
     */
    public function getOccurance()
    {
        return $this->occurance;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return datetime
     */
    public function getLast()
    {
        return $this->last;
    }

    /**
     * @param datetime $last
     */
    public function setLast($last)
    {
        $this->last = $last;
    }

    /**
     * @return int
     *
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param int $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return int
     *
     */
    public function getWidget()
    {
        return $this->widget;
    }

    /**
     * @param int $widget
     */
    public function setWidget($widget)
    {
        $this->widget = $widget;
    }
}