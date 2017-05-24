<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="poll_option")
 */
class PollOption
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
    protected $name;

    /**
    * @ORM\ManyToMany(targetEntity="User", inversedBy="pollOptions")
    * @ORM\JoinTable(name="options_users")
    */
    protected $voters;

    /**
     * 
     * @ORM\ManyToOne(targetEntity="Poll", inversedBy="options")
     * @ORM\JoinColumn(name="poll_id", referencedColumnName="id")
     *
     */
    protected $poll;
    

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
        $this->voters[] = $voters;
    }

    /**
     * @return voters
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