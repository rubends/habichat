<?php

namespace AppBundle\Service;

use AppBundle\Service\Pusher;

class TriggerPusher {

    protected $key;
    protected $secret;
    protected $id;

    public function __construct($key, $secret, $id)
    {
        $this->key = $key;
        $this->secret = $secret;
        $this->id = $id;
    }

    public function trigger($event, $data){

        $options = array(
            'cluster' => 'eu',
            'encrypted' => true
        );

        $pusher = new Pusher(
            $this->key,
            $this->secret,
            $this->id,
            $options
        );
        $pusher->trigger('habichannel', $event, $data);
    }
}