<?php

namespace AppBundle\Controller;

use AppBundle\Entity\User;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @return User
     */
    public function getUserAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $flat = $user->getFlat();
        $widgets = $flat->getWidgets();
        foreach($widgets as $key => $widget){
            $type = $widget->getWidgetType();
            $items = $this->getDoctrine()->getRepository('AppBundle:'.$type)->findByWidget($widget->getId());
            $widget->setItems($items);
        }
        return $user;
    }

    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @return $flat
     */
    public function getUserFlatAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $flat = $user->getFlat();
        return $flat;
    }

    /**
     * @ApiDoc()
     *
     * @return User[]
     */
    public function getUsersAction()
    {
        return $this->getDoctrine()->getRepository('AppBundle:User')->findAll();
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return User
     */
    public function postUserAction(Request $request)
    {
        $data = $request->request->all();

        if ($data['password']==$data['passwordRepeat']) {

            $repository = $this->getDoctrine()->getRepository('AppBundle:User');
            if (!$repository->findOneByEmail($data['email'])) {

                $user = new User();
                $user->setEmail($data['email']);
                $user->setUsername($data['username']);
                $user->setRole("ROLE_USER");
                $user->setFlat("0");

                $encoder = $this->container->get('security.password_encoder');
                $encoded = $encoder->encodePassword($user, $data['password']);
                $user->setPassword($encoded);

                $this->getDoctrine()->getManager()->persist($user);
                $this->getDoctrine()->getManager()->flush();
                return $this->generateToken($user, 201);
            }

            return new JsonResponse(array('error' => "E-mailadress is already taken."));
        }

        return new JsonResponse(array('error' => "passwords don't match"));
    }

    protected function generateToken($user, $statusCode = 200)
    {
        // Generate the token
        $token = $this->get('lexik_jwt_authentication.jwt_manager')->create($user);

        $response = array(
            'token' => $token,
            'username'  => $user->getUsername(),
            'email' => $user->getEmail(),
            'flat_id' => $user->getFlat()
        );

        return new JsonResponse($response, $statusCode); // Return a 201 Created with the JWT.
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return User
     */

    public function postUserLoginAction(Request $request){
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if(is_null($email) || is_null($password)) {
            return new JsonResponse(array('error' => "Not all fields are filled."));
        }

        $repository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $repository->findOneByEmail($email);

        if (!$user) {
            return new JsonResponse(array('error' => "Email is not valid."));
        }

        $encoder = $this->container->get('security.password_encoder');
        if($encoder->isPasswordValid($user, $password)) {
              return $this->generateToken($user, 201);
        } else {
            return new JsonResponse(array('error' => "Password is not valid."));
        }
    }

    /**
     * @ApiDoc()
     *
     * @param User $user
     *
     * @return Response
     */
    public function deleteUserAction(User $user)
    {
        $this->getDoctrine()->getManager()->remove($user);
        $this->getDoctrine()->getManager()->flush();

        return new Response('User deleted', Response::HTTP_NO_CONTENT);
    }

    /**
     * @ApiDoc()
     *
     * @param int $flat
     * @param string $role
     *
     * @return Response
     */
    public function patchUserFlatAction($flat, $role)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $user->setFlat($flat);
        $user->setRole($role);
        $em->flush();

        return new Response('Changed flat', Response::HTTP_NO_CONTENT);
    }
}