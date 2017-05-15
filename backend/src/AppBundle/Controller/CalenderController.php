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
     * @param Request $request
     *
     * @return Calender[]
     */
    public function postCalendersAction(Request $request)
    {
        $calender = new Calender();
        $calender->setTitle($request->request->get('title'));
        $time = new \DateTime($request->request->get('time'));
        $date = new \DateTime($request->request->get('date'));
        $calender->setTime($time);
        $calender->setDate($date);
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $calender->setUserID($user->getId());


        $errors = $this->get('validator')->validate($calender);
        if (count($errors) > 0) {
            $errorStrings = [];
            foreach ($errors as $error) {
                $errorStrings[] = $error->getMessage();
            }
            return $this->view(
                [
                    'error' => implode(',', $errorStrings)
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $this->getDoctrine()->getManager()->persist($calender);
        $this->getDoctrine()->getManager()->flush();

        // return $this->getDoctrine()->getRepository('AppBundle:Calender')->findByUserID($user->getId());
        return $calender;
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
        $this->getDoctrine()->getManager()->remove($calender);
        $this->getDoctrine()->getManager()->flush();

        // $user = $this->get('security.token_storage')->getToken()->getUser();
        // return $this->getDoctrine()->getRepository('AppBundle:Calender')->findByUserID($user->getId());
        return new JsonResponse(array('deleted' => $calender));
    }
}