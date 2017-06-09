<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Bill;
use AppBundle\Entity\Widget;
use AppBundle\Entity\User;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class BillController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param Bill $bill
     * @param User $user
     * @return Bill[]
     */
    public function putBillPaidAction(Bill $bill, User $user)
    {
        $unpaidUsers = $bill->getUnpaidUsers();
        foreach($unpaidUsers as $key => $unpaidUser){
            if($unpaidUser->getId() === $user->getId()){
                $bill->addPaidUser($unpaidUser);
                unset($unpaidUsers[$key]);
                break;
            }
        }
        $bill->setUnpaidUsers($unpaidUsers);

        $this->getDoctrine()->getManager()->persist($bill);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $unpaidUsers = [];
        foreach($bill->getUnpaidUsers() as $key => $unpaidUser){
            $userInfo = ['id' => $unpaidUser->getId(), 'username' => $unpaidUser->getUsername()];
            $unpaidUsers[] = $userInfo;
        }
        $paidUsers = [];
        foreach($bill->getPaidUsers() as $key => $paidUser){
            $userInfo = ['id' => $paidUser->getId(), 'username' => $paidUser->getUsername()];
            $paidUsers[] = $userInfo;
        }
        $data = ['user' => $user->getId(), 'reason' => 'updateItem', 'item' => ['id' => $bill->getId(), 'unpaid_users' => $unpaidUsers, 'paid_users' => $paidUsers, 'widget' => ['id' => $bill->getWidget()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $bill;
    }
}