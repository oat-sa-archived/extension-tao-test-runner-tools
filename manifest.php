<?php
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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 *               
 * 
 */

/**
 * Generated using taoDevTools 2.21.0
 */
return array(
    'name' => 'taoTestRunnerTools',
    'label' => 'TAO Test Runner Tools',
    'description' => 'Experimental tools around the test runner',
    'license' => 'GPL-2.0',
    'version' => '0.1.0',
    'author' => 'Open Assessment Technologies SA',
    'requires' => array(
        'tao' => '>=7.89.2',
        'taoQtiTest' => '>=6.18.3'
    ),
    'managementRole' => 'http://www.tao.lu/Ontologies/generis.rdf#taoTestRunnerToolsManager',
    'acl' => array(
        array('grant', 'http://www.tao.lu/Ontologies/generis.rdf#taoTestRunnerToolsManager', array('ext'=>'taoTestRunnerTools')),
        array('grant', 'http://www.tao.lu/Ontologies/TAO.rdf#DeliveryToolRole', array('ext'=>'taoTestRunnerTools', 'mod' => 'TestRunner')),
    ),
    'install' => array(
        'rdf' => array(
            __DIR__.DIRECTORY_SEPARATOR.'scripts'.DIRECTORY_SEPARATOR.'install'.DIRECTORY_SEPARATOR.'testrunner.rdf'
        )
    ),
    'uninstall' => array(
    ),
    'routes' => array(
        '/taoTestRunnerTools' => 'oat\\taoTestRunnerTools\\controller'
    ),    
    'constants' => array(
        # views directory
        "DIR_VIEWS" => dirname(__FILE__).DIRECTORY_SEPARATOR."views".DIRECTORY_SEPARATOR,
        
        #BASE URL (usually the domain root)
        'BASE_URL' => ROOT_URL.'taoTestRunnerTools/',
        
        #BASE WWW required by JS
        'BASE_WWW' => ROOT_URL.'taoTestRunnerTools/views/'
    ),
    'extra' => array(
        'structures' => dirname(__FILE__).DIRECTORY_SEPARATOR.'controller'.DIRECTORY_SEPARATOR.'structures.xml',
    )
);
