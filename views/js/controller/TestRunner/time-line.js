/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA ;
 */
/**
 * @author Jean-Sébastien Conan <jean-sebastien@taotesting.com>
 */
define([
    'jquery',
    'i18n',
    'moment',
    'util/url',
    'core/logger',
    'core/dataProvider/request',
    'layout/loading-bar',
    'tpl!taoTestRunnerTools/templates/TestRunner/tags',
    'ui/button',
    'ui/datatable'
], function ($,
             __,
             moment,
             urlHelper,
             loggerFactory,
             request,
             loadingBar,
             tagsTpl,
             buttonFactory) {
    'use strict';

    return {
        start: function start() {
            var $container = $('.container');
            var $toolbar = $('.toolbar', $container);
            var $details = $('.details', $container);
            var $content = $('.content', $container);

            var currentRoute = urlHelper.parse(window.location.href);
            var sessionId = currentRoute.query.deliveryExecution && decodeURIComponent(currentRoute.query.deliveryExecution);
            var dataUrl = urlHelper.route('timeLineData', 'TestRunner', 'taoTestRunnerTools', {deliveryExecution: sessionId});

            var buttons = {};

            var logger = loggerFactory('taoTestRunnerTools/TestRunner/timeLine');

            function update() {
                return request(dataUrl)
                    .then(function (data) {
                        var timePoints = data.time && data.time.timeLine || [];

                        $details.html(__('%s - %s', data.state, data.position));

                        timePoints.sort(function (a, b) {
                            return a.ts - b.ts;
                        });

                        $content.datatable('refresh', {
                            data: timePoints
                        });
                    })
                    .catch(function (err) {
                        logger.error(err);
                    });
            }

            function reload() {
                loadingBar.start();
                update().then(function () {
                    loadingBar.stop();
                });
            }

            function back() {
                loadingBar.start();
                window.location.href = urlHelper.route('timer', 'TestRunner', 'taoTestRunnerTools', {deliveryExecution: sessionId});
            }

            buttons.back = buttonFactory({
                id: 'back',
                label: __('Timers'),
                type: 'info',
                icon: 'left',
                renderTo: $toolbar
            }).on('click', back);

            buttons.reload = buttonFactory({
                id: 'reload',
                label: __('Reload'),
                type: 'info',
                icon: 'reload',
                renderTo: $toolbar
            }).on('click', reload);

            $content.on('click', '.tags-list', function () {
                var $tags = $(this).closest('.tags-list');
                var $handle = $tags.find('.handle .icon');
                var $list = $tags.find('.list');

                $list.toggleClass('single');

                if ($list.hasClass('single')) {
                    $handle.removeClass('icon-remove').addClass('icon-add');
                } else {
                    $handle.removeClass('icon-add').addClass('icon-remove');
                }
            });

            $content.datatable({
                paginationStrategyTop: 'none',
                paginationStrategyBottom: 'none',
                model: [{
                    id: 'time',
                    label: __('Time'),
                    transform: function formatTimestamp(dummy, row) {
                        return moment(row.ts * 1000).format('L LTS');
                    }
                }, {
                    id: 'timestamp',
                    label: __('Timestamp'),
                    transform: function formatTimestamp(dummy, row) {
                        return row.ts;
                    }
                }, {
                    id: 'type',
                    label: __('Type'),
                    transform: function formatType(type) {
                        return parseInt(type, 10) === 1 ? __('Start') : __('End');
                    }
                }, {
                    id: 'target',
                    label: __('Target'),
                    transform: function formatTarget(target) {
                        return parseInt(target, 10) === 1 ? __('Client') : __('Server');
                    }
                }, {
                    id: 'tags',
                    label: __('Tags'),
                    transform: function formatTarget(tags) {
                        return tagsTpl(tags);
                    }
                }]
            }, {});

            update();
        }
    };
});
