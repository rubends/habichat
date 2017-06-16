<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Text;
use AppBundle\Entity\Widget;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class TextController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param Widget $widget
     * @param Request $request
     * @return Text[]
     */
    public function postTextAction(Widget $widget, Request $request)
    {
        $text = new Text();
        $text->setText($request->request->get('text'));
        $text->setWidget($widget->getId());

        $this->getDoctrine()->getManager()->persist($text);
        $this->getDoctrine()->getManager()->flush();

        return $text;
    }

    /**
     * @ApiDoc()
     * @param Text $text
     * @param Request $request
     * @return Text[]
     */
    public function putTextAction(Text $text, Request $request)
    {
        $text->setText($request->request->get('text'));
        $this->getDoctrine()->getManager()->persist($text);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $serialiseText = $this->container->get('jms_serializer')->serialize($text, 'json', SerializationContext::create()->setGroups(array('Default')));
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'updateItem', 'item' => $serialiseText];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $text;
    }
}