<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Calender;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class CalenderController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @param Calender $calender
     *
     * @return Calender
     */
    public function getCalenderAction(Calender $calender)
    {
        return $calender;
    }

    /**
     * @ApiDoc()
     *
     * @return Calender[]
     */
    public function getCalendersAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Calender')->findByFlatID($user->getFlat());
    }

    /**
     * @ApiDoc()
     *
     * @param Calender $calender
     *
     * @return Calender[]
     */
    public function deleteCalenderAction(Calender $calender)
    {
        $widget = $calender->getWidget();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        if($calender->getUrl()){
            $type = 'feed';
        } else {
            $type = 'event';
        }
        $data = ['user' => $user->getId(), 'reason' => 'deleteCalItem', 'item' => ['id' => $calender->getId(), 'type' => $type, 'widget' => ['id' => $calender->getWidget()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        $this->getDoctrine()->getManager()->remove($calender);
        $this->getDoctrine()->getManager()->flush();

        return $widget;
    }

    /**
     * @ApiDoc()
     * @param Calender $calender
     * @param Request $request
     * @return Poll[]
     */
    public function putCalenderAction(Calender $calender, Request $request)
    {
        if($request->request->get('title')){
            $calender->setTitle($request->request->get('title'));
        } else {
            $calender->setTitle('url');
        }
        if($request->request->get('allDay')){
            $calender->setAllDay($request->request->get('allDay'));
        } else {
            $calender->setAllDay(false);
        }
        $calender->setUrl($request->request->get('url'));
        
        $startDate = new \DateTime($request->request->get('start')['date']);
        $startDate->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $startTime = new \DateTime($request->request->get('start')['time']);
        $startTime->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $start = new \DateTime($startDate->format('Y-m-d') .' ' .$startTime->format('H:i:s'));
        $calender->setStart($start);

        $endDate = new \DateTime($request->request->get('end')['date']);
        $endDate->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $endTime = new \DateTime($request->request->get('end')['time']);
        $endTime->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $end = new \DateTime($endDate->format('Y-m-d') .' ' .$endTime->format('H:i:s'));
        $calender->setEnd($end);

        $this->getDoctrine()->getManager()->persist($calender);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => $user->getId(), 'reason' => 'updateCalItem', 'item' => ['id' => $calender->getId(), 'title' => $calender->getTitle(), 'all_day' => $calender->getAllDay(), 'url' => $request->request->get('url'), 'end' => $end->getTimestamp()*1000, 'start' => $start->getTimestamp()*1000, 'widget' => ['id' => $calender->getWidget()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $calender;
    }
}