<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Chat;
use AppBundle\Entity\User;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class ChatController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param User $user
     * @param Request $request
     * @return Chat[]
     */
    public function postChatMessageAction(User $user, Request $request)
    {
        $dbUser = $this->get('security.token_storage')->getToken()->getUser();
        if($user->getId() === $dbUser->getId()){
            $chat = new Chat();
            $chat->setUser($dbUser);
            $chat->setFlat($dbUser->getFlat());
            $chat->setText($request->request->get('message'));
            $chat->setSend(new \DateTime('now'));

            $this->getDoctrine()->getManager()->persist($chat);
            $this->getDoctrine()->getManager()->flush();

            $serialiseChat = $this->container->get('jms_serializer')->serialize($chat, 'json', SerializationContext::create()->setGroups(array('Default')));
            
            $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'chat', 'chat' => $serialiseChat];
            $pusher = $this->get('pusher');
            $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

            return $serialiseChat;
            
        }
        return new JsonResponse(array('error' => "MESSAGE_FAIL"));

    }
}