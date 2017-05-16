<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Grocery;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class GroceryController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @param Grocery $grocery
     *
     * @return Grocery
     */
    public function getGroceryAction(Grocery $grocery)
    {
        return $grocery;
    }

    /**
     * @ApiDoc()
     *
     * @return Grocery[]
     */
    public function getGrocerysAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Grocery')->findByFlatID($user->getFlat());
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return Grocery[]
     */
    public function postGrocerysAction(Request $request)
    {
        $grocery = new Grocery();
        $grocery->setItem($request->request->get('item'));

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $grocery->setUserID($user->getId());


        $errors = $this->get('validator')->validate($grocery);
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

        $this->getDoctrine()->getManager()->persist($grocery);
        $this->getDoctrine()->getManager()->flush();

        // return $this->getDoctrine()->getRepository('AppBundle:Grocery')->findByUserID($user->getId());
        return $grocery;
    }

    /**
     * @ApiDoc()
     *
     * @param Grocery $grocery
     *
     * @return Grocery[]
     */
    public function deleteGroceryAction(Grocery $grocery)
    {
        $this->getDoctrine()->getManager()->remove($grocery);
        $this->getDoctrine()->getManager()->flush();
        return new JsonResponse(array('deleted' => $grocery));
    }

    /**
     * @ApiDoc()
     *
     * @return Grocery[]
     */
    public function deleteAllGroceryAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $groceries = $this->getDoctrine()->getRepository('AppBundle:Grocery')->findByFlatID($user->getFlat());

        foreach ($groceries as $grocery) {
            $this->getDoctrine()->getManager()->remove($grocery);
        }
        
        $this->getDoctrine()->getManager()->flush();

        return new JsonResponse(array('API' => "Deleted all groceries."));
    }
}