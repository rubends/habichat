<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity()
 * @ORM\Table(name="chore")
 * @Serializer\ExclusionPolicy("all")
 */
class Chore
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     *
     * @var int
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     * @Serializer\Expose
     * @Serializer\Groups({"Widget"})
     *
     * @var string
     */
    protected $title;

    /**
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Widget"})
     *
     * @var int
     */
    protected $occurance;

    /**
     * @ORM\Column(type="datetime")
     * @Serializer\Expose
     * @Serializer\Groups({"Widget"})
     *
     * @var datetime
     */
    protected $last;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="chores")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * @Serializer\Expose
     * @Serializer\Groups({"Widget"})
     */
    protected $user;

    /**
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Widget"})
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