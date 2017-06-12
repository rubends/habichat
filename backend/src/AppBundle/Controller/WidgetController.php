<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Widget;
use AppBundle\Entity\Todo;
use AppBundle\Entity\Grocery;
use AppBundle\Entity\Text;
use AppBundle\Entity\Picture;
use AppBundle\Entity\Bill;
use AppBundle\Entity\Poll;
use AppBundle\Entity\PollOption;
use AppBundle\Entity\Calender;
use AppBundle\Entity\Chore;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class WidgetController extends FOSRestController
{
    /**
     * @ApiDoc()
     *
     * @return Widget[]
     */
    public function getWidgetsAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $flat = $user->getFlat();
        $widgets = $flat->getWidgets();
        foreach($widgets as $key => $widget){
            $type = $widget->getWidgetType();
            if(class_exists('\\AppBundle\\Entity\\'.$type)) {
                $items = $this->getDoctrine()->getRepository('AppBundle:'.$type)->findByWidget($widget->getId());
                $widget->setItems($items);
            }
        }
        return $widgets;
    }

    /**
     * @ApiDoc()
     * @param Widget $widget
     *
     * @return Widget[]
     */
    public function getWidgetAction(Widget $widget)
    {
        $type = $widget->getWidgetType();
        if(class_exists('\\AppBundle\\Entity\\'.$type)) {
            $items = $this->getDoctrine()->getRepository('AppBundle:'.$type)->findByWidget($widget->getId());
            $widget->setItems($items);
        }

        return $widget;
    }

    /**
     * @ApiDoc()
     * @param Request $request
     * @return Widget[]
     */
    public function postWidgetAction(Request $request)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $flat = $user->getFlat();

        $widget = new Widget();
        $widget->setWidgetType($request->request->get('type'));
        $widget->setTitle($request->request->get('title'));
        $widget->setVisible(1);
        $widget->setUser($user);
        $widget->setFlat($flat);
        $widget->setX(0);
        $widget->setY(0);
        $widget->setWidth(2);
        $widget->setHeight(4);
        $widget->setAdded(new \DateTime('now'));
        $widget->setItems([]);

        $this->getDoctrine()->getManager()->persist($widget);
        $this->getDoctrine()->getManager()->flush();

        if($request->request->get('type') === 'Text'){
            $text = new Text();
            $text->setText($request->request->get('text'));
            $text->setWidget($widget->getId());

            $this->getDoctrine()->getManager()->persist($text);
            $this->getDoctrine()->getManager()->flush();
            $widget->setItems(array($text));
        }

        // $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'postWidget', 'widget' => $widget->getId()];
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'postWidget', 'widget' => ['id' => $widget->getId(), 'widget_type' => $request->request->get('type'), 'title' => $request->request->get('title'),'visible' => 1,'user' => ['id' => $user->getId(), 'username' => $user->getUsername()],'flat' => ['id' => $flat->getId()], 'x' => 0, 'y' => 0, 'width' => 2, 'height' => 4, 'items' => []]];
        // $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'postWidget', 'widget' => $this->container->get('serializer')->serialize($widget, 'json')];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$flat->getFlatToken(), $data);
        return $widget;
    }

    /**
     * @ApiDoc()
     *
     * @param Widget $widget
     *
     * @return Widget[]
     */
    public function deleteWidgetsAction(Widget $widget)
    {
        return new JsonResponse(array('API' => "Delete widget."));
    }

    /**
     * @ApiDoc()
     *
     * @param Widget $widget
     *
     * @return int
     */
    public function putWidgetToggleAction(Widget $widget)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $visible = $widget->getVisible();

        if ($visible==0) {
            $widget->setVisible(1);
            $widget->setAdded(new \DateTime('now'));
            $updateVis = 1;
            $type = $widget->getWidgetType();
            if(class_exists('\\AppBundle\\Entity\\'.$type)) {
                $items = $this->getDoctrine()->getRepository('AppBundle:'.$type)->findByWidget($widget->getId());
                $widget->setItems($items);
            }
        } else {
            if($widget->getUser()->getId() === $user->getId() || $user->getRole() === 'ROLE_ADMIN') {
                $widget->setVisible(0);
                $updateVis = 0;
            }  else {
                return new JsonResponse(array('error' => "User has no rights to delete this widget."));
            }
        }

        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'toggle', 'id' => $widget->getId(), 'visible' => $updateVis];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        $this->getDoctrine()->getManager()->persist($widget);
        $this->getDoctrine()->getManager()->flush();
        return $widget;
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return Widget[]
     */
    public function putWidgetsPlaceAction(Request $request)
    {
        $widgets = $request->request->get('widgets');
        foreach($widgets as $key => $widgetPlace){
            $widget = $this->getDoctrine()->getRepository('AppBundle:Widget')->findOneById($widgetPlace['id']);
            $widget->setX($widgetPlace['x']);
            $widget->setY($widgetPlace['y']);
            $this->getDoctrine()->getManager()->persist($widget);
        };

        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'place', 'widgets' => $widgets];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        
        return new JsonResponse(array('API' => "Saved widget places."));
    }

    /**
     * @ApiDoc()
     *
     * @param Widget $widget
     * @param Request $request
     *
     * @return Widget[]
     */
    public function putWidgetSizeAction(Widget $widget, Request $request)
    {
        $width = $request->request->get('width');
        $height = $request->request->get('height');
        $widget->setWidth($width);
        $widget->setHeight($height);

        $this->getDoctrine()->getManager()->persist($widget);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'size', 'widget' => ['id' => $widget->getId(), 'width' => (int)$width, 'height' => (int)$height]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return new JsonResponse(array('API' => "Changed widget " . $widget->getId() . " to width " . $width . " - height " . $height));
    }

    /**
     * @ApiDoc()
     * @param Widget $widget
     * @param Request $request
     * @return todo[]
     */
    public function postWidgetTodoAction(Widget $widget, Request $request)
    {
        $todo = new Todo();
        $todo->setTitle($request->request->get('title'));
        $todo->setDone(0);
        $todo->setWidget($widget->getId());

        $this->getDoctrine()->getManager()->persist($todo);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'addItem', 'item' => ['id' => $todo->getId(), 'title' => $request->request->get('title'), 'done' => 0, 'widget' => ['id' => $widget->getId()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $todo;
    }

    /**
     * @ApiDoc()
     * @param Widget $widget
     * @param Request $request
     * @return grocery[]
     */
    public function postWidgetGroceryAction(Widget $widget, Request $request)
    {
        $grocery = new Grocery();
        $grocery->setItem($request->request->get('item'));
        $grocery->setWidget($widget->getId());

        $this->getDoctrine()->getManager()->persist($grocery);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'addItem', 'item' => ['id' => $grocery->getId(), 'item' => $request->request->get('item'), 'widget' => ['id' => $widget->getId()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $grocery;
    }

    /**
     * @ApiDoc()
     * @param Widget $widget
     * @param Request $request
     * @return Picture[]
     */
    public function postWidgetPictureAction(Widget $widget, Request $request)
    {
        $image = $request->request->get('image');
        $data = base64_decode($image);
        $f = finfo_open();
        $mime_type = finfo_buffer($f, $data, FILEINFO_MIME_TYPE);
        $file = time().'.'.explode("/", $mime_type)[1];
        $flat = $widget->getFlat();
        mkdir('./uploads/'.$flat->getFlatToken(), 0777, true);
        file_put_contents('./uploads/'.$flat->getFlatToken().'/'.$file, $data);

        $picture = new Picture();
        $picture->setImage($file);
        $picture->setWidget($widget->getId());

        $this->getDoctrine()->getManager()->persist($picture);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'addItem', 'item' => ['id' => $picture->getId(), 'image' => $file, 'widget' => ['id' => $widget->getId()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $picture;
    }

    /**
     * @ApiDoc()
     * @param Widget $widget
     * @param Request $request
     * @return Bill[]
     */
    public function postWidgetBillAction(Widget $widget, Request $request)
    {
        $bill = new Bill();
        $bill->setSummary($request->request->get('summary'));
        $bill->setAmount($request->request->get('amount'));
        $bill->setAccount($request->request->get('account'));
        foreach($request->request->get('users') as $key => $value){
            if($value){
                $unpaidUser = $this->getDoctrine()
                    ->getRepository('AppBundle:User')
                    ->find($key);
                $bill->addUnpaidUser($unpaidUser);
            }
        };
        $bill->setWidget($widget->getId());

        $this->getDoctrine()->getManager()->persist($bill);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $unpaidUsers = [];
        foreach($bill->getUnpaidUsers() as $key => $unpaidUser){
            $userInfo = ['id' => $unpaidUser->getId(), 'username' => $unpaidUser->getUsername()];
            $unpaidUsers[] = $userInfo;
        }
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'addItem', 'item' => ['id' => $bill->getId(), 'summary' => $request->request->get('summary'), 'amount' => $request->request->get('amount'), 'account' => $request->request->get('account'), 'unpaid_users' => $unpaidUsers, 'widget' => ['id' => $widget->getId()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $bill;
    }

    /**
     * @ApiDoc()
     * @param Widget $widget
     * @param Request $request
     * @return Poll[]
     */
    public function postWidgetPollAction(Widget $widget, Request $request)
    {
        $poll = new Poll();
        $poll->setQuestion($request->request->get('question'));
        if($request->request->get('multiple')){
            $poll->setMultiple($request->request->get('multiple'));
        } else {
            $poll->setMultiple(false);
        }
        $date = new \DateTime($request->request->get('until')['date']);
        $date->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $time = new \DateTime($request->request->get('until')['time']);
        $time->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $datetime = new \DateTime($date->format('Y-m-d') .' ' .$time->format('H:i:s'));
        $poll->setUntil($datetime);
    
        $poll->setWidget($widget->getId());
        $this->getDoctrine()->getManager()->persist($poll);
        $this->getDoctrine()->getManager()->flush();

        $options = [];
        foreach($request->request->get('options') as $key => $value){
           $option = new PollOption();
           $option->setName($value['name']);
           $poll->addOption($option);
           $this->getDoctrine()->getManager()->persist($option);
           $this->getDoctrine()->getManager()->flush();
           $options[] = ['id' => $option->getId(), 'name' => $value['name']];
        };

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'addItem', 'item' => ['id' => $poll->getId(), 'question' => $request->request->get('question'), 'multiple' => $request->request->get('multiple'), 'until' => ($datetime->getTimestamp()*1000), 'options' => $options, 'widget' => ['id' => $widget->getId()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);


        return $poll;
    }

    /**
     * @ApiDoc()
     *
     * @param Widget $widget
     * @param Request $request
     *
     * @return Calender[]
     */
    public function postWidgetCalendersAction(Widget $widget, Request $request)
    {
        $calender = new Calender();
        if($request->request->get('title')){
            $calender->setTitle($request->request->get('title'));
        } else {
            $calender->setTitle('url');
        }
        if($request->request->get('allDay')){
            $calender->setAllDay($request->request->get('allDay'));
        } else {
            $calender->setAllDay(false);
        }
        $calender->setUrl($request->request->get('url'));
        $calender->setWidget($widget->getId());
        
        $startDate = new \DateTime($request->request->get('start')['date']);
        $startDate->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $startTime = new \DateTime($request->request->get('start')['time']);
        $startTime->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $start = new \DateTime($startDate->format('Y-m-d') .' ' .$startTime->format('H:i:s'));
        $calender->setStart($start);

        $endDate = new \DateTime($request->request->get('end')['date']);
        $endDate->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $endTime = new \DateTime($request->request->get('end')['time']);
        $endTime->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $end = new \DateTime($endDate->format('Y-m-d') .' ' .$endTime->format('H:i:s'));
        $calender->setEnd($end);

        $this->getDoctrine()->getManager()->persist($calender);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'reason' => 'addCalItem', 'item' => ['id' => $calender->getId(), 'title' => $calender->getTitle(), 'all_day' => $calender->getAllDay(), 'url' => $request->request->get('url'), 'end' => $end->getTimestamp()*1000, 'start' => $start->getTimestamp()*1000, 'widget' => ['id' => $widget->getId()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$user->getFlat()->getFlatToken(), $data);

        return $calender;
    }

    /**
     * @ApiDoc()
     *
     * @param Widget $widget
     * @param Request $request
     *
     * @return Chore[]
     */
    public function postWidgetChoreAction(Widget $widget, Request $request)
    {
        $chore = new Chore();
        $chore->setTitle($request->request->get('title'));
        $chore->setWidget($widget->getId());
        $chore->setOccurance($request->request->get('occurance'));

        $user =  $this->getDoctrine()->getRepository('AppBundle:User')->findOneById($request->request->get('user'));
        $chore->setUser($user);

        $lastDate = new \DateTime($request->request->get('last'));
        $lastDate->setTimezone( new \DateTimeZone('Europe/Berlin') );
        $chore->setLast($lastDate);

        $this->getDoctrine()->getManager()->persist($chore);
        $this->getDoctrine()->getManager()->flush();

        $userLoggedin = $this->get('security.token_storage')->getToken()->getUser();
        $data = ['user' => ['id' => $userLoggedin->getId(), 'username' => $userLoggedin->getUsername()], 'reason' => 'addItem', 'item' => ['id' => $chore->getId(), 'title' => $request->request->get('title'), 'occurance' => $request->request->get('occurance'), 'last' => $lastDate->getTimestamp()*1000, 'user' => ['id' => $user->getId(), 'username' => $user->getUsername()], 'widget' => ['id' => $widget->getId()]]];
        $pusher = $this->get('pusher');
        $pusher->trigger('flat-'.$userLoggedin->getFlat()->getFlatToken(), $data);

        return $chore;
    }
}