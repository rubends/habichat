<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="calender")
 */
class Calender
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
     * @ORM\Column(type="string", nullable=true)
     *
     * @var string
     */
    protected $url;

    /**
     * @ORM\Column(type="datetime")
     *
     * @var datetime
     */
    protected $start;

    /**
     * @ORM\Column(type="datetime")
     *
     * @var datetime
     */
    protected $end;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $allDay;

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
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param string $url
     */
    public function setUrl($url)
    {
        $this->url = $url;
    }


    /**
     * @return datetime
     */
    public function getStart()
    {
        return $this->start;
    }

    /**
     * @param datetime $start
     */
    public function setStart($start)
    {
        $this->start = $start;
    }

    /**
     * @return datetime
     */
    public function getEnd()
    {
        return $this->end;
    }

    /**
     * @param datetime $end
     */
    public function setEnd($end)
    {
        $this->end = $end;
    }

    /**
     * @param bool $allDay
     */
    public function setAllDay($allDay)
    {
        $this->allDay = $allDay;
    }

    /**
     * @return bool
     *
     */
    public function getAllDay()
    {
        return $this->allDay;
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