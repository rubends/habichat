<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Chore;
use AppBundle\Entity\Widget;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class ChoreController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param Chore $chore
     * @return Text[]
     */
    public function deleteWidgetChoreAction(Widget $widget, Chore $chore)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        if($widget->getFlat() === $user->getFlat()){
            $this->getDoctrine()->getManager()->remove($chore);
            $this->getDoctrine()->getManager()->flush();
        }

        return new JsonResponse(array('deleted' => $chore));
    }
}