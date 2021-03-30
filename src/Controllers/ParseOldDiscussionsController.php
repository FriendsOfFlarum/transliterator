<?php

/*
 * This file is part of fof/transliterator
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Transliterator\Controllers;

use Flarum\Discussion\Discussion;
use FoF\Transliterator\Transliterator;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ParseOldDiscussionsController implements RequestHandlerInterface
{
    /**
     * Handle the request and return a response.
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = $request->getAttribute('actor');
        $counter = 0;

        $actor->assertAdmin();

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
            'count'     => $counter,
        ]);
    }
}
