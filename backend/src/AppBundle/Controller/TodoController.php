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
     * @return Todo[]
     */
    public function getTodosAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Todo')->findByFlatID($user->getFlat());
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return Todo[]
     */
    public function postTodosAction(Request $request)
    {
        $todo = new Todo();
        $todo->setTitle($request->request->get('todo'));
        $todo->setDone("0");

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $todo->setUserID($user->getId());


        $errors = $this->get('validator')->validate($todo);
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

        $this->getDoctrine()->getManager()->persist($todo);
        $this->getDoctrine()->getManager()->flush();

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
     * @param int $id
     *
     * @return Todo[]
     */
    public function patchTodoToggleAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $todo = $em->getRepository('AppBundle:Todo')->find($id);
        $done = $todo->getDone();

        if ($done==0) {
            $todo->setDone('1');
        }
        else{
            $todo->setDone('0');
        }

        $em->flush();
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Todo')->findByFlatID($user->getFlat());
    }
}