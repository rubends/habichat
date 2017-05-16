<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Todo;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

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
        $this->getDoctrine()->getManager()->remove($todo);
        $this->getDoctrine()->getManager()->flush();

        // $user = $this->get('security.token_storage')->getToken()->getUser();
        // return $this->getDoctrine()->getRepository('AppBundle:Todo')->findByUserID($user->getId());
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
        return $todo;
    }
}