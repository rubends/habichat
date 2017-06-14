<?php

namespace AppBundle\Controller;

use AppBundle\Entity\PollOption;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class PollController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param PollOption $option
     * @param Request $request
     * @return Poll[]
     */
    public function putPolloptionVoteAction(PollOption $option, Request $request)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $poll = $option->getPoll();

        if($poll->getUntil() < new \DateTime()){
            return new JsonResponse(array('error' => "The voting on this poll has ended."));
        }
        
        if($poll->getMultiple()){
            $vote = true;
            $voters = $option->getVoters();
            if($voters){
                foreach($voters as $key => $voter){
                    if($voter->getId() === $user->getId()){
                        unset($voters[$key]);
                        $vote = false;
                        break;
                    }
                }
            }
            if($vote){
                $option->addVoter($user);
            } else {
                $option->setVoters($voters);
            }
        } else {
            $options = $poll->getOptions();
            foreach($options as $key => $otherOption){
                $optionVoters = $otherOption->getVoters();
                if($optionVoters) {
                    foreach($optionVoters as $key => $optionVoter){
                        if($optionVoter->getId() === $user->getId()){
                            unset($optionVoters[$key]);
                            $otherOption->setVoters($optionVoters);
                            break;
                        }
                    }
                }
            }
            $option->addVoter($user);
        }

        $this->getDoctrine()->getManager()->persist($option);
        $this->getDoctrine()->getManager()->flush();

        $optionArray = [];
        $options = $poll->getOptions();
        foreach($options as $key => $option){
            $voters = [];
            foreach($option->getVoters() as $key => $voter){
                $voters[] = ['id' => $voter->getId(), 'username' => $voter->getUsername()];
            }
            $optionArray[] = ['id' => $option->getId(), 'name' => $option->getName(), 'voters' => $voters];
        }

        $serialiseOptions = $this->container->get('jms_serializer')->serialize($options, 'json', SerializationContext::create()->setGroups(array('Default', 'PollOption')));
            
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'updateItem', 'item' => $serialiseOptions];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $serialiseOptions;
    }
}