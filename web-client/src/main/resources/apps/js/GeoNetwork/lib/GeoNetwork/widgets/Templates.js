    /*
 * Copyright (C) 2001-2011 Food and Agriculture Organization of the
 * United Nations (FAO-UN), United Nations World Food Programme (WFP)
 * and United Nations Environment Programme (UNEP)
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or (at
 * your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 * 
 * Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
 * Rome - Italy. email: geonetwork@osgeo.org
 */
Ext.namespace('GeoNetwork');

/** api: (define)
 *  module = GeoNetwork
 *  class = Templates
 *  base_link = `Ext.XTemplate <http://extjs.com/deploy/dev/docs/?class=Ext.XTemplate>`_
 */
/** api: constructor 
 *  .. class:: GeoNetwork.Templates()
 * 
 *   A template for harvester (experimental)
 */
GeoNetwork.Templates = Ext.extend(Ext.XTemplate, {
    compiled: false,
    disableFormats: false,
    catalogue : null,
    sortOrder: 0,
    abstractMaxSize : 50,
    xmlTplMarkup : [
                    '<?xml version="1.0" encoding="UTF-8"?>',
                    '<node id="{id}" type="{type}">',
                        '<site>',
                            '<name>{site_name}</name>',
                            '<tpl if="values.site_ogctype">',
                                '<ogctype>{site_ogctype}</ogctype>',
                            '</tpl>',
                            '<tpl if="values.site_url">',
                                  '<url>{site_url}</url>',
                            '</tpl>',
                            '<tpl if="values.site_icon">',
                                  '<icon>{site_icon}</icon>',
                            '</tpl>',
                            '<tpl if="values.site_account_use">',
                                '<account>',
                                  '<use>{site_account_use}</use>',
                                  '<username>{site_account_username}</username>',
                                  '<password>{site_account_password}</password>',
                                  '</account>',
                            '</tpl>',
                        '</site>',
                        '<options>',
                              '<tpl if="values.options_every">',
                                  '<every>{options_every}</every>',
                              '</tpl>',
                              '<tpl if="values.options_onerunonly">',
                                  '<oneRunOnly>{options_onerunonly}</oneRunOnly>',
                              '</tpl>',
                              '<tpl if="values.options_lang">',
                                  '<lang>{options_lang}</lang>',
                              '</tpl>',
                              '<tpl if="values.options_topic">',
                                  '<topic>{options_topic}</topic>',
                              '</tpl>',
                              '<tpl if="values.options_createthumbnails">',
                                  '<createThumbnails>{options_createthumbnails}</createThumbnails>',
                              '</tpl>',
                              '<tpl if="values.options_uselayer">',
                                  '<useLayer>{options_uselayer}</useLayer>',
                              '</tpl>',
                              '<tpl if="values.options_uselayermd">',
                                  '<useLayerMd>{options_uselayermd}</useLayerMd>',
                              '</tpl>',
                              '<tpl if="values.options_datasetcategory">',
                                  '<datasetcategory>{options_datasetcategory}</datasetcategory>',
                              '</tpl>',
                        '</options>',
                        '<content>',
                        '</content>',
                        '<privileges>',
                        '</privileges>',
                            '<group id="1">',
                                '<operation name="view" />',
                                '<operation name="dynamic" />',
                            '</group>',
                        '<categories>',
                        '</categories>',
                        '<tpl if="values.info_result_total">',
                        '</tpl>',
                    '</node>'
                    // TODO : other properties - display if available depends on harvester
                ],
    initComponent: function() {
        GeoNetwork.Templates.superclass.initComponent.call(this);
        this.refreshTemplates();
    },
    /** api: method[getHarvesterTemplate]
     *
     *  :return: A template for harvester configuration
     */    
    getHarvesterTemplate: function() {
        return new Ext.XTemplate(this.xmlTplMarkup);
    },

    refreshTemplates: function() {
        GeoNetwork.Templates.TITLE = '<h1><input type="checkbox" <tpl if="selected==\'true\'">checked="true"</tpl> class="selector" onclick="javascript:catalogue.metadataSelect((this.checked?\'add\':\'remove\'), [\'{uuid}\']);"/><a href="#" onclick="javascript:catalogue.metadataShow(\'{uuid}\',\'{istemplate}\');return false;">{title}</a>' +
            '<span class="md-action-menu"> - <a rel="mdMenu">' + OpenLayers.i18n('mdMenu') + '</a></span></h1>';

        GeoNetwork.Templates.THUMBNAIL = new Ext.XTemplate(
            '<ul>',
            '<tpl for=".">',
            '<li class="md md-thumbnail" style="{featurecolorCSS}">',
            '<div class="md-wrap" id="{uuid}" title="{abstract}">',
            GeoNetwork.Templates.TITLE,
            '<div class="thumbnail">',
            '<tpl if="thumbnail && thumbnail.startsWith(\'http\')">',
            '<a rel="lightbox" href="{thumbnail}"><img src="{thumbnail}" alt="Thumbnail"/></a>',
            '</tpl>',
            '<tpl if="thumbnail==\'\' || !thumbnail.startsWith(\'http\')"></tpl>',
            '</div>',
            '<tpl for="links">',
            '<tpl if="values.type == \'application/vnd.ogc.wms_xml\'">',
            // FIXME : ref to app
            '<a href="#" class="md-mn addLayer" title="{title}" alt="{title}" onclick="app.switchMode(\'1\', true);app.getIMap().addWMSLayer([[\'{title}\', \'{href}\', \'{name}\', \'{id}\']]);">&nbsp;</a>',
            '</tpl>',
            '</tpl>',

            '</div>',
            '</li>',
            '</tpl>',
            '</ul>'
        );

    	var prefix = (!GeoNetwork.Settings || GeoNetwork.Settings.nodeType.toLowerCase()!='agiv') ? "" : "agiv_";
    	var showHarvesterLogo = (!GeoNetwork.Settings || GeoNetwork.Settings.nodeType.toLowerCase()!='agiv') ? true : false;
    	var isGeopunt = (GeoNetwork.Settings && GeoNetwork.Settings.nodeType.toLowerCase()=='geopunt') ? true : false;
    	var isAgiv = (GeoNetwork.Settings && GeoNetwork.Settings.nodeType.toLowerCase()=='agiv') ? true : false;
        GeoNetwork.Templates.SIMPLE = new Ext.XTemplate(
            '<ul>',
            '<tpl for=".">',
            '<li class="md md-simple" title="{abstract}" style="{featurecolorCSS}">',
            '<table><tr>',  // FIXME
            '<td style="width:75px;">',
//            isAgiv ? '<tpl if="isharvested==\'y\'">' + GeoNetwork.Templates.LOGO + '</tpl>' + '<tpl if="isharvested==\'n\'">' + GeoNetwork.Templates.GEOPUNT_LOGO + '</tpl>' : '',
//            !isAgiv ? GeoNetwork.Templates.LOGO : '',
//            (isAgiv || isGeopunt) ? '<br/><div class="md-logo-type"><img title="{type}" src="{catalogue.URL}/apps/tabsearch/images/{type}.png"/></div>' : '',
			'</td>',
            '<td id="{uuid}">',
            GeoNetwork.Templates.TITLE,
            '<tpl if="subject">',
            '<span class="subject"><tpl for="subject">',
            '{value}{[xindex==xcount?"":", "]}',
            '</tpl></span>',
            '</tpl>',

            '<tpl if="(values.userauthenticated == \'y\') && (edit==\'true\' || locked==\'y\' || values.canunlock==\'y\' || values.canedit==\'y\')">',
            '<div>',
            // status information
            '<tpl if="edit==\'true\' && status ==\'1\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-blue.png" alt="'+  OpenLayers.i18n(prefix + 'status_1') + '" title="'+  OpenLayers.i18n(prefix + 'status_1') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_1'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'2\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-green.png" alt="'+  OpenLayers.i18n(prefix + 'status_2') + '" title="'+  OpenLayers.i18n(prefix + 'status_2') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_2'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'3\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-black.png" alt="'+  OpenLayers.i18n(prefix + 'status_3') + '" title="'+  OpenLayers.i18n(prefix + 'status_3') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_3'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'4\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_4') + '" title="'+  OpenLayers.i18n(prefix + 'status_4') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_4'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'5\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-red.png" alt="'+  OpenLayers.i18n(prefix + 'status_5') + '" title="'+  OpenLayers.i18n(prefix + 'status_5') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_5'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'6\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-sepia.png" alt="'+  OpenLayers.i18n(prefix + 'status_6') + '" title="'+  OpenLayers.i18n(prefix + 'status_6') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_6'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'7\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_7') + '" title="'+  OpenLayers.i18n(prefix + 'status_7') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_7'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'8\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-green.png" alt="'+  OpenLayers.i18n(prefix + 'status_8') + '" title="'+  OpenLayers.i18n(prefix + 'status_8') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_8'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'9\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-red.png" alt="'+  OpenLayers.i18n(prefix + 'status_9') + '" title="'+  OpenLayers.i18n(prefix + 'status_9') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_9'),
            '</tpl>',
            '<tpl if="edit==\'true\' && (status ==\'0\' || status == \'undefined\')">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-grey.png" alt="'+  OpenLayers.i18n(prefix + 'status_0') + '" title="'+  OpenLayers.i18n(prefix + 'status_0') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_0'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'10\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_10') + '" title="'+  OpenLayers.i18n(prefix + 'status_10') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_10'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'11\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_11') + '" title="'+  OpenLayers.i18n(prefix + 'status_11') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_11'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'12\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_12') + '" title="'+  OpenLayers.i18n(prefix + 'status_12') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_12'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'13\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_13') + '" title="'+  OpenLayers.i18n(prefix + 'status_13') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_13'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'14\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_14') + '" title="'+  OpenLayers.i18n(prefix + 'status_14') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_14'),
            '</tpl>',

            // locked information
            '<tpl if="locked==\'y\'">',
            '<img class="md_status" style="position:static;"  width="30" height="30" src="{catalogue.URL}/images/lock.png" alt="'+  OpenLayers.i18n('metadataLocked') + '" title="'+  OpenLayers.i18n('metadataLocked') + '"/>',
            '</tpl>',

            // can unlock information
            '<tpl if="values.canunlock==\'y\'">',

            '<img class="md_status" style="position:static;"  width="30" height="30" src="{catalogue.URL}/images/keys.png" alt="'+  OpenLayers.i18n('allowedToUnlockMetadata') + '" title="'+  OpenLayers.i18n('allowedToUnlockMetadata') + '"/>',
            '</tpl>',

            // can edit information
            '<tpl if="values.canedit==\'y\'">',
            '<img class="md_status" style="position:static;"  width="30" height="30" src="{catalogue.URL}/images/edit.png" alt="'+  OpenLayers.i18n('allowedToEditMetadata') + '" title="'+  OpenLayers.i18n('allowedToEditMetadata') + '"/>',
            '</tpl>',
            '</div>',
            '</tpl>',

            '</td></tr></table>',
            '</li>',
            '</tpl>',
            '</ul>'
        );

        GeoNetwork.Templates.FULL = new Ext.XTemplate(
            '<ul>',
            '<tpl for=".">',
            '<li class="md md-full" style="{featurecolorCSS}">',
            '<table><tr>',
            '<td class="left">',
//        	isAgiv ? '<tpl if="isharvested==\'y\'">' + GeoNetwork.Templates.LOGO + '</tpl>' + '<tpl if="isharvested==\'n\'">' + GeoNetwork.Templates.GEOPUNT_LOGO + '</tpl>' : '',
//        	!isAgiv ? GeoNetwork.Templates.LOGO : '',
//            (isAgiv || isGeopunt) ? '<br/><div class="md-logo-type"><img title="{type}" src="{catalogue.URL}/apps/tabsearch/images/{type}.png"/></div>' : '',
            '</td>',
            '<td id="{uuid}">',
            GeoNetwork.Templates.TITLE,
            '<p class="abstract">{[values.abstract.substring(0, 350)]} ...</p>',    // FIXME : 250 as parameters
            '<tpl if="values.tempExtentBegin && values.tempExtentBegin!=\'\'">',
            	'<p>From {[values.tempExtentBegin.substring(8, 10) + "/" + values.tempExtentBegin.substring(5, 7) + "/" + values.tempExtentBegin.substring(0, 4)]} to {[values.tempExtentEnd.substring(8, 10) + "/" + values.tempExtentEnd.substring(5, 7) + "/" + values.tempExtentEnd.substring(0, 4)]}</p>',
        	'</tpl>',
            '<tpl if="subject">',
            '<p class="subject"><tpl for="subject">',
            '{value}{[xindex==xcount?"":", "]}',
            '</tpl></p>',
            '</tpl>',
            '<table>',
            '<tpl for="this.getApplicationProfileLinks(values.links)">',
            	'<tr><td style="width:30px"><a href="{[this.getHref(values, true)]}" title="File type {applicationProfile}"><img src="{catalogue.URL}/apps/images/default/{applicationProfile}.png"/></a></td><td><a href="{[this.getHref(values, true)]}">{[this.getTitle(values)]}</a></td></tr>',
            '</tpl>',
            '<tpl for="this.getOtherLinks(values.links)">',
            	'<tr><td style="width:30px"><a href="{[this.getHref(values)]}" class="md-mn md-mn-www" title="Web link">&nbsp;</a></td><td><a href="{[this.getHref(values)]}">{[this.getTitle(values)]}</a></td></tr>',
        	'</tpl>',
            '<tpl for="links">',
	            '<tpl if="values.type == \'application/vnd.ogc.wms_xml\' || values.type == \'OGC:WMS\'">',
	            	'<tr><td style="width:30px"><a href="#" class="md-mn addLayer" class="md-mn md-mn-bookmark" title="Add WMS layer to map" onclick="app.switchMode(\'1\', true);app.getIMap().addWMSLayer([[\'{[this.getTitle(values)]}\', \'{href}\', \'{name}\', \'{id}\']]);">&nbsp;</a></td><td><a href="#" onclick="app.switchMode(\'1\', true);app.getIMap().addWMSLayer([[\'{[this.getTitle(values)]}\', \'{href}\', \'{name}\', \'{id}\']]);">{[this.getTitle(values)]}</a></td></tr>',
	            '</tpl>',
            '</tpl>',
            '<tpl for="links">',
	            '<tpl if="values.type == \'application/vnd.google-earth.kml+xml\'">',
	            	'<tr><td style="width:30px"><a href="#" class="md-mn addLayer" title="Add KML layer to map" onclick="app.switchMode(\'1\', true);app.getIMap().addKMLLayer([[\'{[this.getTitle(values)]}\', \'{href}\', \'{name}\', \'{id}\']]);">&nbsp;</a></td><td><a href="#" onclick="app.switchMode(\'1\', true);app.getIMap().addKMLLayer([[\'{[this.getTitle(values)]}\', \'{href}\', \'{name}\', \'{id}\']]);">{[this.getTitle(values)]}</a></td></tr>',
	            '</tpl>',
            '</tpl>',
            /*'<tpl for="links">',
	            '<tpl if="values.type == \'text/html\'">',
	            	'<tr><td style="width:30px"><a href="{[this.getHref(values)]}" class="md-mn md-mn-www" title="Web link">&nbsp;</a></td><td><a href="{[this.getHref(values)]}" target="_blank">{[this.getTitle(values)]}</a></td></tr>',
	            '</tpl>',
            '</tpl>',*/
            '<tr><td><a href="?uuid={uuid}&hl={catalogue.lang}" target="_blank" class="md-mn md-mn-bookmark" title="{[OpenLayers.i18n(\'view\')]}">&nbsp;</a></td><td><a href="?uuid={uuid}&hl={catalogue.lang}" target="_blank">Permalink to this metadata record</a></td></tr>',
            '</table>',
            '</div>',

            '<tpl if="(values.userauthenticated == \'y\') && (edit==\'true\' || locked==\'y\' || values.canunlock==\'y\' || values.canedit==\'y\')">',
            '<div>',
            // status information
            '<tpl if="edit==\'true\' && status ==\'1\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-blue.png" alt="'+  OpenLayers.i18n(prefix + 'status_1') + '" title="'+  OpenLayers.i18n(prefix + 'status_1') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_1'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'2\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-green.png" alt="'+  OpenLayers.i18n(prefix + 'status_2') + '" title="'+  OpenLayers.i18n(prefix + 'status_2') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_2'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'3\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-black.png" alt="'+  OpenLayers.i18n(prefix + 'status_3') + '" title="'+  OpenLayers.i18n(prefix + 'status_3') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_3'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'4\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_4') + '" title="'+  OpenLayers.i18n(prefix + 'status_4') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_4'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'5\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-red.png" alt="'+  OpenLayers.i18n(prefix + 'status_5') + '" title="'+  OpenLayers.i18n(prefix + 'status_5') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_5'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'6\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-sepia.png" alt="'+  OpenLayers.i18n(prefix + 'status_6') + '" title="'+  OpenLayers.i18n(prefix + 'status_6') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_6'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'7\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_7') + '" title="'+  OpenLayers.i18n(prefix + 'status_7') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_7'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'8\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-green.png" alt="'+  OpenLayers.i18n(prefix + 'status_8') + '" title="'+  OpenLayers.i18n(prefix + 'status_8') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_8'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'9\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-red.png" alt="'+  OpenLayers.i18n(prefix + 'status_9') + '" title="'+  OpenLayers.i18n(prefix + 'status_9') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_9'),
            '</tpl>',
            '<tpl if="edit==\'true\' && (status ==\'0\' || status == \'undefined\')">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-grey.png" alt="'+  OpenLayers.i18n(prefix + 'status_0') + '" title="'+  OpenLayers.i18n(prefix + 'status_0') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_0'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'10\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_10') + '" title="'+  OpenLayers.i18n(prefix + 'status_10') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_10'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'11\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_11') + '" title="'+  OpenLayers.i18n(prefix + 'status_11') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_11'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'12\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_12') + '" title="'+  OpenLayers.i18n(prefix + 'status_12') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_12'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'13\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_13') + '" title="'+  OpenLayers.i18n(prefix + 'status_13') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_13'),
            '</tpl>',
            '<tpl if="edit==\'true\' && status ==\'14\'">',
            '<img class="md_status" src="{catalogue.URL}/images/bullets/bullet-yellow.png" alt="'+  OpenLayers.i18n(prefix + 'status_14') + '" title="'+  OpenLayers.i18n(prefix + 'status_14') + '"/>&nbsp;' + OpenLayers.i18n(prefix + 'status_label') + OpenLayers.i18n(prefix + 'status_14'),
            '</tpl>',
/*
            // locked information
            '<tpl if="locked==\'y\'">',
            '<img class="md_status"  style="position:static;" width="30" height="30" src="{catalogue.URL}/images/lock.png" alt="'+  OpenLayers.i18n('metadataLocked') + '" title="'+  OpenLayers.i18n('metadataLocked') + '"/>',
            '</tpl>',

            // can unlock information
            '<tpl if="values.canunlock==\'y\'">',

            '<img class="md_status" style="position:static;"  width="30" height="30" src="{catalogue.URL}/images/keys.png" alt="'+  OpenLayers.i18n('allowedToUnlockMetadata') + '" title="'+  OpenLayers.i18n('allowedToUnlockMetadata') + '"/>',
            '</tpl>',

            // can edit information
            '<tpl if="values.canedit==\'y\'">',
            '<img class="md_status" style="position:static;"  width="30" height="30" src="{catalogue.URL}/images/edit.png" alt="'+  OpenLayers.i18n('allowedToEditMetadata') + '" title="'+  OpenLayers.i18n('allowedToEditMetadata') + '"/>',
            '</tpl>',
*/
            '</div>',
            '</tpl>',

            '</td><td class="thumb">',
            GeoNetwork.Templates.RATING_TPL,
            '<div class="thumbnail">',
            '<tpl if="thumbnail && thumbnail.startsWith(\'http\')">',
            '<a rel="lightbox" target="_blank" href="{thumbnail}"><img src="{thumbnail}" alt="Thumbnail"/></a>',
            '</tpl>',
            '<tpl if="thumbnail==\'\' || !thumbnail.startsWith(\'http\')"></tpl>',
            '</div>',
            '</td><!--<td class="icon">',
            // Validity and category information
            '<div class="md-mn valid-{valid}" title="' + OpenLayers.i18n('validityInfo'),
            '<tpl for="valid_details">',
            '{values.type}: ',
            '<tpl if="values.valid == \'1\'">' + OpenLayers.i18n('valid')  + '</tpl>',
            '<tpl if="values.valid == \'0\'">' + OpenLayers.i18n('notValid')  + '</tpl>',
            '<tpl if="values.valid == \'-1\'">' + OpenLayers.i18n('notDetermined')  + '</tpl>',
            '<tpl if="values.ratio != \'\'"> ({values.ratio}) </tpl> - ',
            '</tpl>',
            '">&nbsp;</div>',
            '</td><td class="icon" title="' + OpenLayers.i18n('metadataCategories') + '">',
            '<tpl for="category">',
            '<div class="md-mn cat-{value}" title="{value}">&nbsp;</div>',
            '</tpl>',
            '</td>--></tr></table>',
            '<div class="relation" title="' + OpenLayers.i18n('relateddatasets') + '"><span></span><ul id="md-relation-{id}"></ul></div>',
            '<div class="md-contact">',
            '<tpl for="contact">',
            // metadata contact are not displayed.
/*
            '<tpl if="applies==\'resource\'">',
            '<span title="{role} - {applies}">',
            '<tpl if="values.logo !== undefined && values.logo !== \'\'">',
            '<img src="{logo}" class="orgLogo"/>',
            '</tpl>',
            '{name}&nbsp;&nbsp;</span>',
            '</tpl>',
*/
            '<tpl if="values.logo !== undefined && values.logo !== \'\'">',
            	'<img alt="{name}" title="{name}" src="{catalogue.URL}/images/logos/{values.logo}" style="max-width:200px" class="orgLogo"/><span>&nbsp;&nbsp;</span>',
            '</tpl>',
//            '<span>{name}&nbsp;&nbsp;</span>',
            '</tpl>',
            '<tpl if="edit==\'true\' && isharvested!=\'y\'">',
            '<br/><span class="md-mn md-mn-user" title="' + OpenLayers.i18n('ownerName') + '">{ownername} - ' + OpenLayers.i18n('lastUpdate') + '{[values.changedate.split(\'T\')[0]]}</span>',
            '</tpl>',
            '</div>',
            '</li>',
            '</tpl>',
            '</ul>',
            {
                getTitle: function(values) {
                	if (values.title!=null && values.title.length>0) {
//                		return escape(values.title);
                		return values.title;
                	} else {
                		return values.name;
                	} 
            	},
            	getApplicationProfileLinks: function(links){
            		var supportedProfiles = ['datafile','report','documentation'];
                	var selectedLinks = {datafile:[],report:[],documentation:[]};
                	for (var i = 0; i < links.length; i++) {
                        switch(links[i].type) {
	                        case 'application/vnd.ogc.wms_xml':
	                        case 'OGC:WMS':
	                        case 'application/vnd.google-earth.kml+xml':
//	                        case 'text/html':
	                        	break;
	                    	default:
	                    		if (supportedProfiles.contains(links[i].applicationProfile)) {
	                    			selectedLinks[links[i].applicationProfile].push(links[i]);
	                    		}
	                    		break;
	                    }
                    }
                    return selectedLinks.datafile.concat(selectedLinks.report,selectedLinks.documentation);
            	},
            	getOtherLinks: function(links){
            		var alreadyProcessedProfiles = ['datafile','report','documentation'];
                	var selectedLinks = [];
                	for (var i = 0; i < links.length; i++) {
                		if (!alreadyProcessedProfiles.contains(links[i].applicationProfile)) {
                            switch(links[i].type) {
	                            case 'application/vnd.ogc.wms_xml':
	                            case 'OGC:WMS':
	                            case 'application/vnd.google-earth.kml+xml':
	                            case 'text/html':
	                            	break;
                            	default:
                        			selectedLinks.push(links[i]);
                            		break;
                            }
                		}
                    }
                    return selectedLinks;
                },
                user: null,
                getHref: function(values, showPopup){
                	// TODO: add support for guest profiles --> MD privileges naar buiten trekken + user obj naar buiten trekken
                	if(catalogue.isIdentified()) {
                		if(this.user == null || this.user.id == null || this.user.id != catalogue.identifiedUser.id) {
                			//request user groups of current user
                    		var groupsRequest = OpenLayers.Request.GET({
                    			url: catalogue.services.userGroups,
                    			async: false,
                    			params: {
                    				id: catalogue.identifiedUser.id
                    			}
                    		});
                    		var groupsRegex = new RegExp('(<name>)(?:[^])*?(<\/name>)', 'gm');
                    		var groups = groupsRequest.responseText.match(groupsRegex);
                    		
                    		this.user = {
                				id: catalogue.identifiedUser.id,
                				groups: groups,
                				downloadPermissions: {}
                    		}
                		}
                   	} else if(this.user == null || this.user.id) {
                   		this.user = {
                   			id: null,
                   			groups: null,
                   			downloadPermissions: {}
                   		}
                   	}
                	
                	if(!this.user.downloadPermissions.hasOwnProperty(values.uuid)){
            			this.user.downloadPermissions[values.uuid] = false;
            			var privilegesRequest = OpenLayers.Request.GET({
                			url: catalogue.services.mdAdminXML,
                			async: false,
                			params: {
                				id: values.uuid
                			}
                		});
            			if(this.user.groups) {
            				for(var i=0; i<this.user.groups.length; i++) {
                    			//groups[i] = groups[i].replace('<name>','').replace('</name>','');
            					if(this.isGroupValid(this.user.groups[i], privilegesRequest.responseText)) {
            						this.user.downloadPermissions[values.uuid] = true;
                    				return;
            					}
                    		}
            			} else {
            				if(this.isGroupValid('<name>all</name>', privilegesRequest.responseText)) {
            					this.user.downloadPermissions[values.uuid] = true;
            				}
            			}
            		}

                	var value = values.href + '" target="_blank"  onclick="catalogue.sendGAEvent(values.href)';
                	//if (values.isPrivate=="true" && !catalogue.isIdentified()) {
                	if(!this.user.downloadPermissions[values.uuid]) {
                		value = '#" target onclick="Ext.Msg.alert(\'Permission denied\', \'' + (catalogue.isIdentified() ? OpenLayers.i18n('notRightPermissionsForDownload') : OpenLayers.i18n('notRegisteredForDownload')) + '\')';
                	} else if(showPopup) {
                		value = '#" target onclick="catalogue.downloadProduct(\'' + values.href + '\')';
                	}
                	return value;
                }, isGroupValid: function(group, privileges) {
                	var regex = new RegExp('(' + group + ')(?:[^])*?(<id>1<\/id>)(?:[^])*?(<\/oper>)', 'gm');
        			var opers = privileges.match(regex);
        			if(opers && opers[0]){
        				regex = new RegExp('(<oper>)(?:[^])*?(<\/oper>)', 'gm');
            			var downloadOper = opers[0].match(regex)[1];
            			return (downloadOper.search('<on />') != -1);
        			} else {
        				return false;
        			}
                }
            }
        );

    }


});


// Initialized in refreshTemplates method to get correct language
GeoNetwork.Templates.TITLE = '';

GeoNetwork.Templates.RATING_TPL = '<tpl if="isharvested==\'n\' || harvestertype==\'geonetwork\'"><div class="rating">' +
                                           '<input type="radio" name="rating{[xindex]}" <tpl if="rating==\'1\'">checked="true"</tpl> value="1"/>' + 
                                           '<input type="radio" name="rating{[xindex]}" <tpl if="rating==\'2\'">checked="true"</tpl> value="2"/>' + 
                                           '<input type="radio" name="rating{[xindex]}" <tpl if="rating==\'3\'">checked="true"</tpl> value="3"/>' +
                                           '<input type="radio" name="rating{[xindex]}" <tpl if="rating==\'4\'">checked="true"</tpl> value="4"/>' +
                                           '<input type="radio" name="rating{[xindex]}" <tpl if="rating==\'5\'">checked="true"</tpl> value="5"/>' + 
                                       '</div></tpl>'; 
GeoNetwork.Templates.LOGO = '<div class="md-logo"><img src="{catalogue.URL}/images/logos/{source}.gif"/></div>';
//GeoNetwork.Templates.GEOPUNT_LOGO = '<div><img src="{catalogue.URL}/images/logos/geopunt.png"/></div>';
/** api: constructor 
 *  .. class:: GeoNetwork.Templates.SIMPLE()
 * 
 *   An instance of a pre-configured GeoNetwork.Templates with title and 
 *   keywords with abstract in tooltip.
 */
// Initialized in refreshTemplates method to get correct language
GeoNetwork.Templates.SIMPLE = new Ext.XTemplate('');



/** api: constructor 
 *  .. class:: GeoNetwork.Templates.THUMBNAIL()
 * 
 *   An instance of a pre-configured GeoNetwork.Templates with thumbnail view
 */
// Initialized in refreshTemplates method to get correct language
GeoNetwork.Templates.THUMBNAIL = new Ext.XTemplate('');

/** api: constructor 
 *  .. class:: GeoNetwork.Templates.FULL()
 * 
 *   An instance of a pre-configured GeoNetwork.Templates with full view
 */// Initialized in refreshTemplates method to get correct language
GeoNetwork.Templates.FULL = new Ext.XTemplate('');

GeoNetwork.Templates.Relation = {
        SHORT: ['<div class="{type}">',
                   '<a href="#" onclick="javascript:catalogue.metadataShow(\'{uuid}\',\'{istemplate}\');return false;" title="{abstract}">{title}</a>',
                 '</div>']
};


GeoNetwork.Templates.KEYWORD_ITEM = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="ux-mselect-item" title="{definition}">{value}</div>',
    '</tpl>'
);

GeoNetwork.Templates.THESAURUS_HEADER = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="thesaurusInfo"><span class="title">{title}</span><span class="theme">{theme}</span><span class="filename">({filename})</span></div>',
    '</tpl>'
);