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
    'lodash',
    'i18n',
    'moment',
    'util/url',
    'core/encoder/time',
    'core/logger',
    'core/dataProvider/request',
    'layout/loading-bar',
    'tpl!taoTestRunnerTools/templates/TestRunner/tags',
    'ui/button',
    'ui/datatable'
], function ($,
             _,
             __,
             moment,
             urlHelper,
             timeEncoder,
             loggerFactory,
             request,
             loadingBar,
             tagsTpl,
             buttonFactory) {
    'use strict';

    /**
     * Computes a simple hash code from a string.
     * Port of Java’s `String.hashCode()`.
     * @param {String} str
     * @returns {String}
     */
    function hashCode(str) {
        var hash = 0;
        var len = str.length;
        var i, c;

        if (len > 0) {
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + c;
                hash = hash & hash; // Convert to 32bit integer
            }
        }
        return hash.toString(16);
    }

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
                        var ranges = {};

                        $details.html(__('%s - %s', data.state, data.position));

                        timePoints.sort(function (a, b) {
                            return a.ts - b.ts;
                        });

                        // gather timePoints by targets and ranges
                        _.forEach(timePoints, function (timePoint) {
                            var hash = hashCode(timePoint.tags.join(','));
                            timePoint.hash = hash;

                            ranges[hash] = ranges[hash] || {
                                1: [],
                                2: []
                            };
                            ranges[hash][timePoint.target].push(timePoint);
                        });

                        // compute duration of each range
                        _.forEach(ranges, function (targets) {
                            _.forEach(targets, function (range) {
                                _.forEach(range, function (timePoint, idx) {
                                    var previous = range[idx - 1];
                                    if (idx % 2) {
                                        if (timePoint.type === 2 && previous.type === 1) {
                                            timePoint.duration = timePoint.ts - previous.ts;
                                        } else {
                                            timePoint.duration = -1;
                                        }
                                    }
                                });
                            });
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

            function index() {
                loadingBar.start();
                window.location.href = urlHelper.route('index', 'TestRunner', 'taoTestRunnerTools');
            }

            function timer() {
                loadingBar.start();
                window.location.href = urlHelper.route('timer', 'TestRunner', 'taoTestRunnerTools', {deliveryExecution: sessionId});
            }

            buttons.index = buttonFactory({
                id: 'baindexck',
                label: __('Index'),
                type: 'info',
                icon: 'left',
                renderTo: $toolbar
            }).on('click', index);

            buttons.reload = buttonFactory({
                id: 'reload',
                label: __('Reload'),
                type: 'info',
                icon: 'reload',
                renderTo: $toolbar
            }).on('click', reload);

            buttons.timer = buttonFactory({
                id: 'timer',
                label: __('Timers'),
                type: 'info',
                icon: 'time',
                renderTo: $toolbar
            }).on('click', timer);

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
                    id: 'duration',
                    label: __('Duration'),
                    transform: function formatDuration(duration) {
                        if (typeof duration !== 'undefined') {
                            if (duration < 0) {
                                return __('Inconsistent range!');
                            }
                            return duration && timeEncoder.encode(duration + 's') || '-';
                        }
                        return '';
                    }
                }, {
                    id: 'hash',
                    label: __('Hash')
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
