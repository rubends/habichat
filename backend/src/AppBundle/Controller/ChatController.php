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

            $data = ['user' => $user->getId(), 'reason' => 'chat', 'chat' => ['id' => $chat->getId(), 'text' => $chat->getText(), 'send' => $chat->getSend(), 'user' => ['id' => $user->getId(), 'username' => $user->getUsername()]]];
            $pusher = $this->get('pusher');
            $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

            return $chat;
        }
        return new JsonResponse(array('error' => "The message wasn't send."));

    }
}