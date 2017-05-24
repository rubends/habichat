<?php

namespace AppBundle\Controller;

use AppBundle\Entity\PollOption;
use AppBundle\Entity\User;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class Poll extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param PollOption $option
     * @param User $user
     * @param Request $request
     * @return Poll[]
     */
    public function putPollOptionVoteAction(PollOption $option, User $user, Request $request)
    {
        $voters = $option->getVoters();
        $voted = 0;
        foreach($voters as $key => $voter){
            if($voter->getId() === $user->getID()){
                $voted = 1;
                unset($voters[$key]);
                break;
            }
        }
        if($voted === 0){
            $option->addVoter($user);
        }
        $this->getDoctrine()->getManager()->persist($option);
        $this->getDoctrine()->getManager()->flush();

        return $option->getPoll();
    }
}