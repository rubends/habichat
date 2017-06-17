<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Grocery;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class GroceryController extends FOSRestController
{
    /**
     * @ApiDoc()
     *
     * @param Grocery $grocery
     *
     * @return Grocery[]
     */
    public function deleteGroceryAction(Grocery $grocery)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'deleteItem', 'item' => ['id' => $grocery->getId(), 'widget' => $grocery->getWidget()]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);
        $this->getDoctrine()->getManager()->remove($grocery);
        $this->getDoctrine()->getManager()->flush();
        return new JsonResponse(array('deleted' => $grocery));
    }
}