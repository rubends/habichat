<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Flat;
use AppBundle\Entity\Invite;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializationContext;

class FlatController extends FOSRestController
{
    /**
     * @ApiDoc()
     * @param Flat $flat
     *
     * @return $flat
     */
    public function getFlatAction(Flat $flat)
    {
        if($flat->getId() !== $this->get('security.token_storage')->getToken()->getUser()->getFlat()->getId()){
            return new JsonResponse(array('error' => "WRONG_FLAT"));
        }
        $widgets = $flat->getWidgets();
        foreach($widgets as $widget){
            $type = $widget->getWidgetType();
            if(class_exists('\\AppBundle\\Entity\\'.$type)) {
                $items = $this->getDoctrine()->getRepository('AppBundle:'.$type)->findByWidget($widget->getId());
                $widget->setItems($items);
            }
        }
        $serialiseFlat = $this->container->get('jms_serializer')->serialize($flat, 'json', SerializationContext::create()->setGroups(array('Default', 'Widget', 'Flat', 'Poll')));
        return $serialiseFlat;
    }

    /**
     * @ApiDoc()
     *
     * @return $flat
     */
    public function getFlatsAction()
    {
        $flat = $this->get('security.token_storage')->getToken()->getUser()->getFlat();
        if(!$flat){
            return false;
        }
        $widgets = $flat->getWidgets();
        foreach($widgets as $widget){
            $type = $widget->getWidgetType();
            if(class_exists('\\AppBundle\\Entity\\'.$type)) {
                $items = $this->getDoctrine()->getRepository('AppBundle:'.$type)->findByWidget($widget->getId());
                $widget->setItems($items);
            }
        }
        $serialiseFlat = $this->container->get('jms_serializer')->serialize($flat, 'json', SerializationContext::create()->setGroups(array('Default', 'Widget', 'Flat', 'Poll')));
        return $serialiseFlat;
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return Flat
     */
    public function postFlatAction(Request $request)
    {
        $data = $request->request->all();
        
        $flat = new Flat();
        $flat->setName($data['name']);
        $flat->setStreet($data['street']);
        $flat->setNumber($data['number']);
        $flat->setZipcode($data['zipcode']);
        $flat->setCity($data['city']);
        $flat->setCountry($data['country']);
        // DEFAULT
        $flat->setBackgroundImage('background.jpg?v='.time());
        $flat->setWidgetColor('#ffffff');
        $flat->setHeaderColor('#00897b');
        $flat->setFontColor('#111111');
        $flat->setHeaderFontColor('#ffffff');

        $this->getDoctrine()->getManager()->persist($flat);
        $key = md5(uniqid($flat->getId(), true));
        $flat->setFlatToken($key);

        mkdir('./uploads/'.$key, 0777, true);
        copy('./cork.jpg', './uploads/'.$key.'/background.jpg');
        
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $user->setFlat($flat);
        $user->setRole('ROLE_ADMIN');

        $this->getDoctrine()->getManager()->flush();
        
        return ['user' => $user, 'flat' => $flat];
    }

    /**
     * @ApiDoc()
     *
     * @param Flat $flat
     *
     * @return Response
     */
    public function deleteFlatAction(Flat $flat)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();

        if(count($flat->getUsers()) <= 1){
            if ($flat->getUsers()->contains($user)){
                $user->setFlat(null);
                $this->getDoctrine()->getManager()->remove($flat);
                $this->getDoctrine()->getManager()->flush();
            } else {
                return new JsonResponse(array('error' => "WRONG_FLAT"));
            }
        } else {
            return new JsonResponse(array('error' => "OTHERS_IN_FLAT"));
        }

        return $user;
    }

    /**
     * @ApiDoc()
     *
     * @param Flat $flat
     * @param Request $request
     *
     * @return Response
     */
    public function putFlatAction(Flat $flat, Request $request)
    {
        $flat->setWidgetColor($request->request->get('widget_color'));
        $flat->setHeaderColor($request->request->get('header_color'));
        $flat->setFontColor($request->request->get('font_color'));
        $flat->setHeaderFontColor($request->request->get('header_font_color'));
        $flat->setStreet($request->request->get('street'));
        $flat->setNumber($request->request->get('number'));
        $flat->setZipcode($request->request->get('zipcode'));
        $flat->setCity($request->request->get('city'));
        $flat->setCountry($request->request->get('country'));
        $flat->setName($request->request->get('name'));

        $this->getDoctrine()->getManager()->persist($flat);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'flatUpdate', 'flat' => ['widget_color' => $flat->getWidgetColor(), 'header_color' => $flat->getHeaderColor(), 'font_color' => $flat->getFontColor(), 'header_font_color' => $flat->getHeaderFontColor(), 'street' => $flat->getStreet(), 'number' => $flat->getNumber(), 'zipcode' => $flat->getZipcode(), 'city' => $flat->getCity(), 'country' => $flat->getCountry(), 'name' => $flat->getName()]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $flat;
    }

    /**
     * @ApiDoc()
     *
     * @param Flat $flat
     * @param Request $request
     *
     * @return Response
     */
    public function putFlatImageAction(Flat $flat, Request $request)
    {
        $image = $request->request->get('image');
        $data = base64_decode($image);
        $f = finfo_open();
        $mime_type = finfo_buffer($f, $data, FILEINFO_MIME_TYPE);
        $file = "background.".explode("/", $mime_type)[1];
        mkdir('./uploads/'.$flat->getFlatToken(), 0777, true);
        file_put_contents('./uploads/'.$flat->getFlatToken().'/'.$file, $data);
        $flat->setBackgroundImage($file."?v=".time());

        $this->getDoctrine()->getManager()->persist($flat);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'backgroundUpdate', 'background_image' => $flat->getBackgroundImage()];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $flat;
    }
    
}