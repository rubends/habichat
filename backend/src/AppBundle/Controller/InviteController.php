<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Invite;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class InviteController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param $key
     *
     * @return Response
     */
    public function getInviteAction($key)
    {
        $invite = $this->getDoctrine()
            ->getRepository('AppBundle:Invite')
            ->findOneByInviteKey($key);

        if(!$invite){
            return new JsonResponse(array('error' => "INVALID_INVITE"));
        } else if($invite->getAccepted()){
            return new JsonResponse(array('error' => "USED_INVITE"));
        } else if($invite->getSendDate()->getTimestamp() <= strtotime('-2 day')){
            return new JsonResponse(array('error' => "EXPIRED_INVITE"));
        } else {
            $user = $this->getDoctrine()
            ->getRepository('AppBundle:User')
            ->findOneByEmail($invite->getRecipient());
            return ['invite' => $invite, 'user' => $user];
        }
    }
    /**
     * @ApiDoc()
     * @param Request $request
     *
     * @return Response
     */
    public function postInvitesAction(Request $request)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        foreach($request->request->get('invites') as $invited){
            $invited = $invited['email'];
            if($invited){
                $invite = new Invite();
                $invite->setInviter($user);
                $invite->setFlat($user->getFlat());
                $invite->setRecipient($invited);
                $invite->setSendDate(new \DateTime('now'));
                $key = md5(uniqid($invited, true));
                $invite->setInviteKey($key);
                $invite->setAccepted(false);
                $this->getDoctrine()->getManager()->persist($invite);
                $this->getDoctrine()->getManager()->flush();

                $message = \Swift_Message::newInstance()
                    ->setSubject($user->getUsername() . ' invited you to join his flat')
                    ->setFrom('invite@habichat.com')
                    ->setTo($invited)
                    ->setBody(
                        $this->renderView(
                            'Emails/invite.html.twig',
                            array('name' => $invited, 'owner' => $user->getUsername(), 'key' => $key)
                        ),
                        'text/html'
                    )
                    ;
                $this->get('mailer')->send($message);
            }
        }

        return $invite;
    }
}