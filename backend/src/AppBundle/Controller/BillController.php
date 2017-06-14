<?php

namespace AppBundle\Controller;

use AppBundle\Entity\BillPayer;
use AppBundle\Entity\Bill;
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
     * @param BillPayer $payer
     * @return BillPayer[]
     */
    public function putBillPayerAction(Bill $bill, BillPayer $payer)
    {
        if($payer->getPaid() == 0){
            $payer->setPaid(1);
        } else {
            $payer->setPaid(0);
        }

        $this->getDoctrine()->getManager()->persist($payer);
        $this->getDoctrine()->getManager()->flush();

        $billpayers = [];
        foreach($bill->getPayers() as $key => $payer){
            $user = $payer->getUser();
            $payInfo = ['id' => $payer->getId(), 'amount' => $payer->getAmount(), 'paid' => $payer->getPaid(), 'user' => ['id' => $user->getId(), 'username' => $user->getUsername()]];
            $billpayers[] = $payInfo;
        }

        
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'updateItem', 'item' => ['id' => $bill->getId(), 'summary' => $bill->getSummary(), 'amount' => $bill->getAmount(), 'bill_payers' => $billpayers, 'widget' => ['id' => $bill->getWidget()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $bill;
    }
}