<?php
namespace AppBundle\EventListener;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();

        if($user->getFlat()){
            $flat = $user->getFlat()->getId();
        } else {
            $flat = null;
        }

        $payload = array_merge(
            $event->getData(),
            [
                'id' => $user->getId(),
                'flat' => $flat
            ]
        );

        $event->setData($payload);
    }
}