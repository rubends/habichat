<?php

namespace AppBundle\Controller;

use AppBundle\Entity\User;
use AppBundle\Entity\Reset;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class UserController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param User $user
     *
     * @return User
     */
    public function getUserAction(User $user)
    {
        $userDB = $this->get('security.token_storage')->getToken()->getUser();
        if($user->getId() === $userDB->getId()){
            $serialiseUser = $this->container->get('jms_serializer')->serialize($user, 'json', SerializationContext::create()->setGroups(array('Default', 'User')));
            $user->setLastLogin(new \DateTime('now'));
            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();
            $calKey = $this->getParameter('google_cal_key');
            return ['user' => $serialiseUser, 'calKey' => $calKey];
        }
        return new JsonResponse(array('error' => "ERROR"));
        
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
                $user->setLastLogin(new \DateTime('now'));

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

            return new JsonResponse(array('error' => "EMAIL_TAKEN"));
        }

        return new JsonResponse(array('error' => "PASS_NOT_MATCH"));
    }

    protected function generateToken($user, $statusCode = 200)
    {
        // Generate the token
        $token = $this->get('lexik_jwt_authentication.jwt_manager')->create($user);

        $response = [
                'token' => $token,
                'id'  => $user->getId(),
                'flat' => $user->getFlat() ? ['id' => $user->getFlat()->getId()] : false
            ];

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
            return new JsonResponse(array('error' => "FIELDS_NOT_FILLED"));
        }

        $repository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $repository->findOneByEmail($email);

        if (!$user) {
            return new JsonResponse(array('error' => "EMAIL_INVALID"));
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
            return new JsonResponse(array('error' => "PASS_INVALID"));
        }
    }

    /**
     * @ApiDoc()
     * @param User $user
     * @return Response
     */
    public function deleteUsersFlatAction(User $user)
    {
        $userLoggedIn = $this->get('security.token_storage')->getToken()->getUser();
        if($user->getId() === $userLoggedIn->getId() || $userLoggedIn->getRole() === 'ROLE_ADMIN'){
            if($user->getRole() === 'ROLE_ADMIN'){
                $admins = $this->getDoctrine()->getRepository('AppBundle:User')->findBy(array('flat' => $user->getFlat(), 'role' => 'ROLE_ADMIN'));
                if(count($admins) <= 1){
                    return new JsonResponse(array('error' => "DELETE_ONLY_ADMIN"));
                }
            }
            $user->setFlat(null);
            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();

            return $this->get('security.token_storage')->getToken()->getUser()->getFlat();
        } else {
            return new JsonResponse(array('error' => "DELETE_NOT_ALLOWED"));
        }
    }

    /**
     * @ApiDoc()
     * @param User $user
     * @return Response
     */
    public function putUsersRoleAction(User $user)
    {
        $userDb = $this->get('security.token_storage')->getToken()->getUser();
        if($userDb->getRole() === 'ROLE_ADMIN'){
            $role = $user->getRole();
            if($role === 'ROLE_ADMIN'){
                $user->setRole('ROLE_USER');
            } else if ($role === 'ROLE_USER') {
                $user->setRole('ROLE_ADMIN');
            }
        }
        
        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $user;
    }

    /**
     * @ApiDoc()
     * @param User $user
     * @param Request $request
     *
     * @return Response
     */
    public function putUserUpdateAction(User $user, Request $request)
    {
        $userDb = $this->get('security.token_storage')->getToken()->getUser();
        if($user->getId() === $userDb->getId()){
            $user->setEmail($request->request->get('email'));
            $user->setUsername($request->request->get('username'));
        }

        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $user;
    }

    /**
     * @ApiDoc()
     * @param User $user
     * @param Request $request
     *
     * @return Response
     */
    public function putUserPasswordAction(User $user, Request $request)
    {
        $userDb = $this->get('security.token_storage')->getToken()->getUser();
        if($user->getId() === $userDb->getId()){
            $data = $request->request->all();
            $encoder = $this->container->get('security.password_encoder');

            if($encoder->isPasswordValid($user, $data['old'])) {
                if ($data['new']==$data['repeat']) {
                    $encoded = $encoder->encodePassword($user, $data['new']);
                    $user->setPassword($encoded);
                } else {
                    return new JsonResponse(array('error' => "PASS_NOT_MATCH"));
                }
            } else {
                return new JsonResponse(array('error' => "PASS_INVALID"));
            }
        }

        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $user;
    }

    /**
     * @ApiDoc()
     * @param Request $request
     *
     * @return Response
     */
    public function postUserPasswordResetAction(Request $request)
    {
        $email = $request->request->get('email');
        $repository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $repository->findOneByEmail($email);
        if($user) {
            $reset = new Reset();
            $reset->setUser($user);
            $reset->setSendDate(new \DateTime('now'));
            $key = md5(uniqid($email, true));
            $reset->setResetKey($key);
            $this->getDoctrine()->getManager()->persist($reset);
            $this->getDoctrine()->getManager()->flush();

            $message = \Swift_Message::newInstance()
                ->setSubject('Password reset')
                ->setFrom('invite@habichat.com')
                ->setTo($email)
                ->setBody(
                    $this->renderView(
                        'Emails/reset.html.twig',
                        array('name' => $user->getUsername(), 'key' => $key)
                    ),
                    'text/html'
                )
                ;
            $this->get('mailer')->send($message);
        } else {
            return new JsonResponse(array('error' => "EMAIL_INVALID"));
        }

        return $user;
    }

    /**
     * @ApiDoc()
     * @param Request $request
     *
     * @return Response
     */
    public function putUsersResetAction(Request $request)
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');
        if(is_null($email) || is_null($password)) {
            return new JsonResponse(array('error' => "FIELDS_NOT_FILLED"));
        }
        if($password != $request->request->get('passwordRepeat')) {
            return new JsonResponse(array('error' => "PASS_NOT_MATCH"));
        }

        $reset = $this->getDoctrine()->getRepository('AppBundle:Reset')->findOneByResetKey($request->request->get('resetKey'));
        $user = $reset->getUser();

        if($reset->getSendDate()->getTimestamp() >= strtotime('-1 day')){
            if($user->getEmail() === $email){
                $encoder = $this->container->get('security.password_encoder');
                $encoded = $encoder->encodePassword($user, $password);
                $user->setPassword($encoded);
                $this->getDoctrine()->getManager()->persist($user);
                $this->getDoctrine()->getManager()->flush();
                return $this->generateToken($user, 201);
            } else {
                return new JsonResponse(array('error' => "RESET_NOT_BELONGING"));
            }
        } else {
            return new JsonResponse(array('error' => "RESET_INVALID"));
        }
    }

    /**
     * @ApiDoc()
     * @return $lastlogin
     */
    public function postUserLastloginAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $lastlogin = new \DateTime('now');
        $user->setLastLogin($lastlogin);
        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();
        return $lastlogin->getTimestamp()*1000;
    }
}