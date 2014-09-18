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
Ext.namespace('GeoNetwork.data');

/** api: (define) 
 *  module = GeoNetwork.data
 *  class = ValidationRuleStore
 */
/** api: method[ValidationRuleStore]
 *  A pre-configured `Ext.data.JsonStore <http://extjs.com/deploy/dev/docs/?class=Ext.data.JsonStore>`_
 *  for GeoNetwork validation report rules.
 *
 *  :param url: ``String`` Usually the xml.metadata.validate service URL.
 *  
 *  :param grouping: ``boolean`` Set to true to return a Ext.data.GroupingStore
 */
GeoNetwork.data.ValidationRuleStore = function(gridPanel, grouping){
/*
    function getStatusIcon(v, record){
        var status = record.getAttribute('type');
        return '<span class="' + status + '" onclick="GeoNetwork.Util.scrollEditorPanelElement(\'' + record.getAttribute('parent') + '\',\'' + record.getAttribute('ref') + '\')">&#160;</span>';
    }
*/    
    function countInvalidRecords(store, records, options) {
		var valids = 0;
		var invalids = 0;
    	for (var i=0;i<records.length;i++) {
			if ("success"==records[i].get("status")) {
				valids++
			} else {
				invalids++;
			}
    	}
		gridPanel.setTitle(OpenLayers.i18n('validationReport') + ": <span style='color:red'> <b>" + invalids + " invalid(s)</b></span><span style='color:#fff'>" + valids + " valid(s) </span>");
	}

    
    var fields = [{
        name: 'id',
        mapping: '@id'
    }, {
        name: 'group',
        mapping: '@group'
    }, {
        name: 'status',
        mapping: '@type'
    },/* {
        name: 'statusIcon',
        convert: getStatusIcon
    },*/ {
        name: 'parent',
        mapping: '@parent'
    }, {
        name: 'ref',
        mapping: '@ref'
    }, {
        name: 'title'
    }, {
        name: 'details'
    }, {
        name: 'msg'
    }];
    var store;
    var params = {id: gridPanel.metadataId};
    if (grouping) {
        var reader = new Ext.data.XmlReader({
            record: 'rule',
            idProperty: 'id'
        }, fields);
        
        store = new Ext.data.GroupingStore({
            autoDestroy: true,
            proxy: new Ext.data.HttpProxy({
                method: 'POST',
                url: gridPanel.serviceUrl,
                params: params,
                disableCaching: false
            }),
            reader: reader,
            groupField: 'group',
            sortInfo: {
                field: 'status',
                direction: "ASC"
            },
            listeners: {
            	load: countInvalidRecords
        	}
        });
    } else {
        store = new Ext.data.XmlStore({
            autoDestroy: true,
            proxy: new Ext.data.HttpProxy({
                method: 'GET',
                url: gridPanel.serviceUrl,
                params: params,
                disableCaching: false
            }),
            record: 'rule',
            idPath: '@id',
            fields: fields,
            sortInfo: {
                field: 'status',
                direction: "ASC"
            },
            listeners: {
            	load: countInvalidRecords
        	}
        });
    }
    return store;
};
