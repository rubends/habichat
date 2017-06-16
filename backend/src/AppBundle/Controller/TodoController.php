<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Todo;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class TodoController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @param Todo $todo
     *
     * @return Todo
     */
    public function getTodoAction(Todo $todo)
    {
        return $todo;
    }

    /**
     * @ApiDoc()
     *
     * @param Todo $todo
     *
     * @return Todo[]
     */
    public function deleteTodoAction(Todo $todo)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'deleteItem', 'item' => ['id' => $todo->getId(), 'widget' => $todo->getWidget()]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);
        $this->getDoctrine()->getManager()->remove($todo);
        $this->getDoctrine()->getManager()->flush();
        return new JsonResponse(array('deleted' => $todo));
    }

    /**
     * @ApiDoc()
     *
     * @param Todo $todo
     *
     * @return Todo[]
     */
    public function putTodoToggleAction(Todo $todo)
    {
        $done = $todo->getDone();

        if ($done==0) {
            $todo->setDone('1');
        }
        else{
            $todo->setDone('0');
        }

        $this->getDoctrine()->getManager()->persist($todo);
        $this->getDoctrine()->getManager()->flush();

        $serialiseTodo = $this->container->get('jms_serializer')->serialize($todo, 'json', SerializationContext::create()->setGroups(array('Default')));
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'updateItem', 'item' => $serialiseTodo];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);
        return $todo;
    }
}