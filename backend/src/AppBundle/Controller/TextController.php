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
}