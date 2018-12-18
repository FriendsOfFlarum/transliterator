<?php

/**
 *  This file is part of fof/transliterator.
 *
 *  Copyright (c) 2018 FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 */

namespace FoF\Transliterator\Controllers;

use Flarum\Discussion\Discussion;
use Flarum\Discussion\DiscussionRepository;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Symfony\Component\Translation\TranslatorInterface;
use Zend\Diactoros\Response\JsonResponse;
use Illuminate\Contracts\Bus\Dispatcher;
use Behat\Transliterator\Transliterator;

class ParseOldDiscussionsController implements RequestHandlerInterface
{
    use AssertPermissionTrait;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var DiscussionRepository
     */
    protected $discussions;

    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param TranslatorInterface $translator
     * @param DiscussionRepository $discussions
     * @param Dispatcher $bus
     */
    public function __construct(TranslatorInterface $translator, DiscussionRepository $discussions, Dispatcher $bus)
    {
        $this->translator = $translator;
        $this->discussions = $discussions;
        $this->bus = $bus;
    }

    /**
     * Handle the request and return a response.
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request)  : ResponseInterface
    {
        $actor = $request->getAttribute('actor');
        $counter = 0;

        $this->assertAdmin($actor);

        foreach (Discussion::cursor() as $discussion) {
            $slug = Transliterator::transliterate($discussion->title);

            if ($discussion->slug !== $slug) {
                $discussion->slug = $slug;
                $discussion->save();

                $counter++;
            }
        }

        return new JsonResponse([
            'success'   => true,
            'count'   => $counter
        ]);
    }
}
