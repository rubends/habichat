<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="picture")
 */
class Picture
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
    protected $image;

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
     *
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param string $image
     */
    public function setImage($image)
    {
        $this->image = $image;
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