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
        if($flat){
            $widgets = $flat->getWidgets();
            foreach($widgets as $key => $widget){
                $type = $widget->getWidgetType();
                if(class_exists('\\AppBundle\\Entity\\'.$type)) {
                    $items = $this->getDoctrine()->getRepository('AppBundle:'.$type)->findByWidget($widget->getId());
                    $widget->setItems($items);
                }
            }
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

                $encoder = $this->container->get('security.password_encoder');
                $encoded = $encoder->encodePassword($user, $data['password']);
                $user->setPassword($encoded);

                if($data['invitation']){
                    $flat = $this->getDoctrine()
                        ->getRepository('AppBundle:Flat')
                        ->find($data['flat']);
                    $user->setFlat($flat);
                    $invite = $this->getDoctrine()
                        ->getRepository('AppBundle:Invite')
                        ->find($data['invitation']);
                    $invite->setAccepted(1);
                }

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
            'flat' => $user->getFlat()
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
              if($request->request->get('invitation')){
                    $flat = $this->getDoctrine()
                        ->getRepository('AppBundle:Flat')
                        ->find($request->request->get('flat'));
                    $user->setFlat($flat);
                    $invite = $this->getDoctrine()
                        ->getRepository('AppBundle:Invite')
                        ->find($request->request->get('invitation'));
                    $invite->setAccepted(1);
                    $this->getDoctrine()->getManager()->flush();
                }
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
     * @param User $user
     * @return Response
     */
    public function deleteUsersFlatAction(User $user)
    {
        if($user->getRole() === 'ROLE_ADMIN'){
            $admins = $this->getDoctrine()->getRepository('AppBundle:User')->findBy(array('flat' => $user->getFlat(), 'role' => 'ROLE_ADMIN'));
            if($admins.length <= 1){
                return new JsonResponse(array('error' => "You can't delete the only admin!"));
            }
        }
        $user->setFlat(null);
        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $this->get('security.token_storage')->getToken()->getUser()->getFlat();
    }

    /**
     * @ApiDoc()
     * @param User $user
     * @return Response
     */
    public function putUsersRoleAction(User $user)
    {
        $role = $user->getRole();
        if($role === 'ROLE_ADMIN'){
            $user->setRole('ROLE_USER');
        } else if ($role === 'ROLE_USER') {
            $user->setRole('ROLE_ADMIN');
        }

        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $user;
    }
}