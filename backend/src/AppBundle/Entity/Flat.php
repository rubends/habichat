<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity()
 * @ORM\Table(name="flat")
 *
 * @Serializer\ExclusionPolicy("all")
 */
class Flat
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
     * @Serializer\Groups({"Default"})
     *
     * @var string
     */
    protected $name;

    /**
     * @ORM\Column(type="string")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat"})
     *
     * @var string
     */
    protected $street;

    /**
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat"})
     *
     * @var int
     */
    protected $number;

    /**
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat"})
     *
     * @var int
     */
    protected $zipcode;

    /**
     * @ORM\Column(type="string")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat"})
     *
     * @var string
     */
    protected $city;

    /**
     * @ORM\Column(type="string")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat"})
     *
     * @var string
     */
    protected $country;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "User"})
     */
    protected $backgroundImage;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "User"})
     */
    protected $widgetColor;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "User"})
     */
    protected $headerColor;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "User"})
     */
    protected $fontColor;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "User"})
     */
    protected $headerFontColor;

    /**
    * @ORM\OneToMany(targetEntity="User", mappedBy="flat")
    * @Serializer\Expose
    * @Serializer\Groups({"Flat"})
    */
    protected $users;

    /**
    * @ORM\OneToMany(targetEntity="Widget", mappedBy="flat")
    * @Serializer\Expose
    * @Serializer\Groups({"Flat"})
    */
    private $widgets;

    /**
    * @ORM\OneToMany(targetEntity="Invite", mappedBy="flat")
    * @Serializer\Expose
    * @Serializer\Groups({"Flat"})
    */
    protected $invites;

    /**
     * @ORM\Column(type="string")
     * @Serializer\Expose
     * @Serializer\Groups({"Flat", "User"})
     */
    protected $flatToken;

    /**
    * @ORM\OneToMany(targetEntity="Chat", mappedBy="flat")
    * @Serializer\Expose
    * @Serializer\Groups({"Flat"})
    */
    protected $chats;

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

    /**
     * @return string
     *
     * @Validator\NotNull()
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * @param string $street
     */
    public function setStreet($street)
    {
        $this->street = $street;
    }

    /**
     * @return int
     *
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @param int $number
     */
    public function setNumber($number)
    {
        $this->number = $number;
    }

    /**
     * @return int
     *
     */
    public function getZipcode()
    {
        return $this->zipcode;
    }

    /**
     * @param int $zipcode
     */
    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;
    }

    /**
     * @return string
     *
     */
    public function getBackgroundImage()
    {
        return $this->backgroundImage;
    }

    /**
     * @param string $backgroundImage
     */
    public function setBackgroundImage($backgroundImage)
    {
        $this->backgroundImage = $backgroundImage;
    }

    /**
     * @return string
     *
     */
    public function getWidgetColor()
    {
        return $this->widgetColor;
    }

    /**
     * @param string $widgetColor
     */
    public function setWidgetColor($widgetColor)
    {
        $this->widgetColor = $widgetColor;
    }

    /**
     * @return string
     *
     */
    public function getHeaderColor()
    {
        return $this->headerColor;
    }

    /**
     * @param string $headerColor
     */
    public function setHeaderColor($headerColor)
    {
        $this->headerColor = $headerColor;
    }

    /**
     * @return string
     *
     */
    public function getFontColor()
    {
        return $this->fontColor;
    }

    /**
     * @param string $fontColor
     */
    public function setFontColor($fontColor)
    {
        $this->fontColor = $fontColor;
    }

    /**
     * @return string
     *
     */
    public function getHeaderFontColor()
    {
        return $this->headerFontColor;
    }

    /**
     * @param string $headerFontColor
     */
    public function setHeaderFontColor($headerFontColor)
    {
        $this->headerFontColor = $headerFontColor;
    }

    /**
     * @return users
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param $users
     */
    public function setUsers($users)
    {
        $this->users = $users;
    }

    /**
     * @return widgets
     */
    public function getWidgets()
    {
        return $this->widgets;
    }

    /**
     * @param $widgets
     */
    public function setWidgets($widgets)
    {
        $this->widgets = $widgets;
    }

    /**
     * @return invites
     */
    public function getInvites()
    {
        return $this->invites;
    }

    /**
     * @param $invites
     */
    public function setInvites($invites)
    {
        $this->invites = $invites;
    }

    /**
     * @return string
     *
     * @Validator\NotNull()
     */
    public function getFlatToken()
    {
        return $this->flatToken;
    }

    /**
     * @param string $flatToken
     */
    public function setFlatToken($flatToken)
    {
        $this->flatToken = $flatToken;
    }

    /**
     * @return string
     *
     * @Validator\NotNull()
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * @param string $city
     */
    public function setCity($city)
    {
        $this->city = $city;
    }

    /**
     * @return string
     *
     * @Validator\NotNull()
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * @param string $country
     */
    public function setCountry($country)
    {
        $this->country = $country;
    }

     /**
     * @return chats
     */
    public function getChats()
    {
        return $this->chats;
    }

    /**
     * @param $chats
     */
    public function setChats($chats)
    {
        $this->chats = $chats;
    }
}