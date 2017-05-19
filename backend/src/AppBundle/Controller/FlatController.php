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

class FlatController extends FOSRestController
{
    /**
     * @ApiDoc()
     *
     * @param Flat $flat
     *
     * @return $flat
     */
    public function getFlatAction(Flat $flat)
    {
        return $flat;
    }

    /**
     * @ApiDoc()
     *
     * @return Flat[]
     */
    public function getFlatsAction()
    {
        return $this->getDoctrine()->getRepository('AppBundle:Flat')->findAll();
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
        // DEFAULT
        $flat->setBackgroundImage('cork.jpg');

        $this->getDoctrine()->getManager()->persist($flat);
        
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $user->setFlat($flat);
        $user->setRole('ROLE_ADMIN');

        $this->getDoctrine()->getManager()->flush();
        
        return $flat;
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
        $this->getDoctrine()->getManager()->remove($flat);
        $this->getDoctrine()->getManager()->flush();

        return new Response('Flat deleted', Response::HTTP_NO_CONTENT);
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

        $this->getDoctrine()->getManager()->persist($flat);
        $this->getDoctrine()->getManager()->flush();

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
        $file = $flat->getName().$flat->getId().".".explode("/", $mime_type)[1];
        file_put_contents('./uploads/backgrounds/'.$file, $data);
        $flat->setBackgroundImage($file."?v=".time());

        $this->getDoctrine()->getManager()->persist($flat);
        $this->getDoctrine()->getManager()->flush();

        return $flat;
    }
    
}