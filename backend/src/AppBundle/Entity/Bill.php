<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="bill")
 */
class Bill
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
    protected $summary;

    /**
     * 
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    protected $amount;

    /**
     * 
     * @ORM\Column(type="string")
     *
     * @var string
     */
    protected $account;

    /**
     * @ORM\ManyToMany(targetEntity="User", inversedBy="bills")
     * @ORM\JoinTable(name="bills_unpaid_users")
     */
    protected $unpaidUsers;

    /**
     * @ORM\ManyToMany(targetEntity="User", inversedBy="paid")
     * @ORM\JoinTable(name="bills_paid_users")
     */
    protected $paidUsers;

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
    public function getSummary()
    {
        return $this->summary;
    }

    /**
     * @param string $summary
     */
    public function setSummary($summary)
    {
        $this->summary = $summary;
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

    /**
     * @return int
     *
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * @param int $amount
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    /**
     * @return string
     *
     */
    public function getAccount()
    {
        return $this->account;
    }

    /**
     * @param string $account
     */
    public function setAccount($account)
    {
        $this->account = $account;
    }

    public function addUnpaidUser(User $user)
    {
        $user->addBill($this);
        $this->unpaidUsers[] = $user;
    }

    /**
     * @return unpaidUsers
     */
    public function getUnpaidUsers()
    {
        return $this->unpaidUsers;
    }

    /**
     * @param $unpaidUsers
     */
    public function setUnpaidUsers($unpaidUsers)
    {
        $this->unpaidUsers = $unpaidUsers;
    }

    public function addPaidUser(User $user)
    {
        $user->addPaid($this);
        $this->paidUsers[] = $user;
    }

    /**
     * @return paidUsers
     */
    public function getPaidUsers()
    {
        return $this->paidUsers;
    }

    /**
     * @param $paidUsers
     */
    public function setPaidUsers($paidUsers)
    {
        $this->paidUsers = $paidUsers;
    }
}