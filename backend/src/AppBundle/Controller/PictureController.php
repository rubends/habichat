<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Picture;
use AppBundle\Entity\Widget;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class PictureController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param Widget $widget
     * @param Request $request
     * @return Picture[]
     */
    public function postPictureAction(Widget $widget, Request $request)
    {
        $picture = new Picture();
        $picture->setImage($request->request->get('image'));
        $picture->setWidget($widget->getId());

        $this->getDoctrine()->getManager()->persist($picture);
        $this->getDoctrine()->getManager()->flush();

        return $picture;
    }
}