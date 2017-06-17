<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity()
 * @ORM\Table(name="widget")
 */
class Widget
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
     * @Serializer\Groups({"Flat", "Widget"})
     *
     * @var string
     */
    protected $widgetType;

    /**
     * @ORM\Column(type="string")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "Widget"})
     *
     * @var string
     */
    protected $title;

    /**
     * 
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "Widget", "WidgetToggle"})
     *
     * @var int
     */
    protected $visible;

    /**
     * 
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "Widget"})
     *
     * @var int
     */
    protected $x;

    /**
     * 
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "Widget"})
     *
     * @var int
     */
    protected $y;

    /**
     * 
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "Widget"})
     *
     * @var int
     */
    protected $width;

    /**
     * 
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat","Widget"})
     *
     * @var int
     */
    protected $height;

    /**
     * 
     * @ORM\Column(type="datetime")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat","Widget"})
     *
     * @var datetime
     */
    protected $added;


    /**
     * @ORM\ManyToOne(targetEntity="Flat", inversedBy="widgets")
     * @ORM\JoinColumn(name="flat_id", referencedColumnName="id")
     * @Serializer\Expose
     * @Serializer\Groups({"Widget"})
     */
    protected $flat;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="widgets")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "Widget"})
     */
    protected $user;

    /*
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "Widget"})
     */
    protected $items;

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
     * @Validator\NotNull()
     */
    public function getWidgetType()
    {
        return $this->widgetType;
    }

    /**
     * @param string $widgetType
     */
    public function setWidgetType($widgetType)
    {
        $this->widgetType = $widgetType;
    }

    /**
     * @return string
     *
     * @Validator\NotNull()
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
     * @return int
     *
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * @param int $visible
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
    }

    /**
     * @return int
     *
     */
    public function getX()
    {
        return $this->x;
    }

    /**
     * @param int $x
     */
    public function setX($x)
    {
        $this->x = $x;
    }

    /**
     * @return int
     *
     */
    public function getY()
    {
        return $this->y;
    }

    /**
     * @param int $y
     */
    public function setY($y)
    {
        $this->y = $y;
    }
    /**
     * @return int
     *
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param int $width
     */
    public function setWidth($width)
    {
        $this->width = $width;
    }

    /**
     * @return int
     *
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @param int $height
     */
    public function setHeight($height)
    {
        $this->height = $height;
    }

    /**
     * @return datetime
     *
     */
    public function getAdded()
    {
        return $this->added;
    }

    /**
     * @param datetime $added
     */
    public function setAdded($added)
    {
        $this->added = $added;
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

    public function getItems()
    {
        return $this->items;
    }

    public function setItems($items)
    {
        $this->items = $items;
    }
}