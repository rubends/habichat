<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="poll")
 */
class Poll
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
    protected $question;

    /**
     * 
     * @ORM\Column(type="boolean")
     *
     * @var boolean
     */
    protected $multiple;

    /**
     * 
     * @ORM\Column(type="datetime")
     *
     * @var datetime
     */
    protected $until;

    /**
    * @ORM\OneToMany(targetEntity="PollOption", mappedBy="poll")
    */
    protected $options;

    /**
     * @ORM\Column(type="integer")
     * @var int
     */
    protected $widget;
    
    public function __construct()
    {
        $this->options = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * @param string $question
     */
    public function setQuestion($question)
    {
        $this->question = $question;
    }

    /**
     * @return bool
     *
     */
    public function getMultiple()
    {
        return $this->multiple;
    }

    /**
     * @param bool $multiple
     */
    public function setMultiple($multiple)
    {
        $this->multiple = $multiple;
    }

    /**
     * @return datetime
     *
     */
    public function getUntil()
    {
        return $this->until;
    }

    /**
     * @param datetime $until
     */
    public function setUntil($until)
    {
        $this->until = $until;
    }

    public function addOption(PollOption $option)
    {
        $option->setPoll($this);
        $this->options[] = $option;
    }

    /**
     * @return options
     *
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param array $options
     */
    public function setOptions($options)
    {
        $this->options = $options;
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