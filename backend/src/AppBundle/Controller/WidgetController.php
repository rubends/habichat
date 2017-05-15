<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Widget;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class WidgetController extends FOSRestController
{
    /**
     * @ApiDoc()
     *
     * @return Widget[]
     */
    public function getWidgetsAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $flat = $user->getFlat();
        return $flat->getWidgets();
    }

    /**
     * @ApiDoc()
     * @param Request $request
     * @return Widget[]
     */
    public function postWidgetAction(Request $request)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $flat = $user->getFlat();
        $widgetArray = $flat->getWidgets();
        $place = count($widgetArray) + 1;

        $widget = new Widget();
        $widget->setWidgetType($request->request->get('type'));
        $widget->setTitle($request->request->get('title'));
        $widget->setVisible(1);
        $widget->setPlace($place);
        $widget->setUser($user);
        $widget->setFlat($flat);
        $widget->setSize(2);

        $this->getDoctrine()->getManager()->persist($widget);
        $this->getDoctrine()->getManager()->flush();

        return $widget;
    }

    // /**
    //  * @ApiDoc()
    //  *
    //  * @return Widget[]
    //  */
    // public function postWidgetsUserAction()
    // {
    //     $user = $this->get('security.token_storage')->getToken()->getUser();
    //     $userId = $user->getId();

    //     $place = -1; //every widget gets the next place
    //     $widgets = ['todo', 'weather', 'joke', 'catGifs', 'groceryList', 'analogClock', 'digitalClock', 'meeting'];
    //     foreach ($widgets as $widget) {
    //         $widget = new Widget();
    //         $widget->setWidget($widget);
    //         $widget->setVisible(0);
    //         $place++;
    //         $widget->setPlace($place);
    //         $widget->setSize(2);
    //         $widget->setUserId($userId);
    //         $this->getDoctrine()->getManager()->persist($widget);
    //         $this->getDoctrine()->getManager()->flush();
    //     }
    //     return new JsonResponse(array('API' => "Post widget."));
    // }

    /**
     * @ApiDoc()
     *
     * @param Widget $widget
     *
     * @return Widget[]
     */
    public function deleteWidgetsAction(Widget $widget)
    {
        return new JsonResponse(array('API' => "Delete widget."));
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     *
     * @return int
     */
    public function patchWidgetToggleAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('AppBundle:Widget')->find($id);
        $visible = $widget->getVisible();

        if ($visible==0) {
            $widget->setVisible(1);
            $updateVis = 1;
        }
        else{
            $widget->setVisible(0);
            $updateVis = 0;
        }

        $em->flush();
        return $updateVis;
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     * @param int $place
     *
     * @return Widget[]
     */
    public function patchWidgetPlaceAction($id, $place)
    {
        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('AppBundle:Widget')->find($id);

        $widget->setPlace($place);

        $em->flush();
        return new JsonResponse(array('API' => "Changed place widget."));
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     * @param int $size
     *
     * @return Widget[]
     */
    public function patchWidgetSizeAction($id, $size)
    {
        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('AppBundle:Widget')->find($id);

        $widget->setSize($size);

        $em->flush();
        return new JsonResponse(array('API' => "Changed size widget."));
    }
}