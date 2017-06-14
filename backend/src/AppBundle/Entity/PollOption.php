<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity()
 * @ORM\Table(name="poll_option")
 * @Serializer\ExclusionPolicy("all")
 */
class PollOption
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
     * 
     * @ORM\Column(type="string")
     * @Serializer\Expose
     * @Serializer\Groups({"Poll", "PollOption"})
     *
     * @var string
     */
    protected $name;

    /**
    * @ORM\ManyToMany(targetEntity="User", inversedBy="pollOptions")
    * @ORM\JoinTable(name="options_users")
    * @Serializer\Expose
     * @Serializer\Groups({"Poll", "PollOption"})
    */
    protected $voters;

    /**
     * 
     * @ORM\ManyToOne(targetEntity="Poll", inversedBy="options")
     * @ORM\JoinColumn(name="poll_id", referencedColumnName="id")
     * @Serializer\Expose
     * @Serializer\Groups({"PollOption"})
     *
     */
    protected $poll;
    
    public function __construct()
    {
        $this->voters = new \Doctrine\Common\Collections\ArrayCollection();
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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    public function addVoter(User $user)
    {
        $user->addPollOption($this);
        $this->voters[] = $user;
    }

    /**
     * @return array voters
     */
    public function getVoters()
    {
        return $this->voters;
    }

    /**
     * @param $voters
     */
    public function setVoters($voters)
    {
        $this->voters = $voters;
    }

    /**
     * @return poll
     *
     */
    public function getPoll()
    {
        return $this->poll;
    }

    /**
     * @param $poll
     */
    public function setPoll($poll)
    {
        $this->poll = $poll;
    }
}