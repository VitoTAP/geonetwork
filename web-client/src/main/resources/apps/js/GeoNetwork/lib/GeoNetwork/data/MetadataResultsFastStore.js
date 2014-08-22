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
 *  class = MetadataResultsFastStore
 */
/** api: constructor 
 *  .. class:: GeoNetwork.data.MetadataResultsFastStore()
 *
 *   A pre-configured `Ext.data.JsonStore <http://extjs.com/deploy/dev/docs/?class=Ext.data.JsonStore>`_
 *   for GeoNetwork results.
 *   
 *   To be used with the "q" search service which use only index content.
 *   
 *   
 *   TODO : Merge by extension with MetadataResultsStore
 *
 */
GeoNetwork.data.MetadataResultsFastStore = function(){
	var separator = "|";
	var logos = [
 	    "Flemish Institute for Technological Research (VITO)",
 	    "Stichting Dienst Landbouwkundig Onderzoek (ALTERRA)",
 	    "Université Catholique de Louvain (UCL)",
 	    "Agricultural Research Institute for Development (CIRAD)",
 	    "Faculty of Geo-information Science & Earth Observation (ITC-UT)",
 	    "IIASA",
 	    "Food and Agricultural Organization of the UN (FAO)",
 	    "Space Research Institute (IKI)",
 	    "DEIMOS Imaging S.L",
 	    "Sarmap SA (SARMAP)",
 	    "EFTAS Fernerkundung Technologietransfer GmbH",
 	    "GeoVille",
 	    "Regional Centre for Mapping Resources for Development (RCMRD)",
 	    "centre Regional AGRHYMET (AGRHYMET)",
 	    "Geosas Plc",
 	    "Instituto Nacional de Tecnologia Agropecuaria (INTA)",
 	    "GISAT s.r.o",
 	    "SARVISION"
 	];
	
    function getTitle(v, record){
        if (record.title && record.title[0]) {
            return record.title[0].value;
        } else {
            return '';
        }
    }
    function getValidationInfo(v, record){
        if (record.valid) {
            return record.valid[0].value;
        } else {
            return '-1';
        }
    }
    function getValidationDetails(v, record){
        var i, validity = [], validInfo;
        for (var key in record) {
    	   if (record.hasOwnProperty(key) && key.indexOf('valid_') !== -1) {
    	     var obj = record[key];
    	     validity.push({
                 valid: obj[0].value,
                 type: key.split('_')[1],
                 ratio: '' // TODO
             });
    	   }
    	}
        return validity;
    }
    
    function getThumbnails(v, record){
        var i;
        var uri = '';
        var currentUri;
        
        if (record.image) {
        
            for (i = 0; i < record.image.length; i++) {
            	var tokens = record.image[i].value.split(separator);
                currentUri = tokens[1];
                // Return the first URL even if not http (FIXME ?)
                if (currentUri.indexOf('http') !== -1 || i === 0) {
                    uri = currentUri;
                }
            }
        }
        return uri;
    }
    
    function getContact(v, record){
        var i, contact = [], el, name;
        
        if (record.responsibleParty) {
            var addedContacts = [];
            for (i = 0; i < record.responsibleParty.length; i++) {
                var tokens = record.responsibleParty[i].value.split(separator);
                var name = tokens[2];
                var typeOfContact = tokens[0];
                if (!Ext.isEmpty(name) && !addedContacts.contains(name)) {
                    contact.push({
                        applies: tokens[1],
                        logo: (name && name!='' && logos.contains(name) && typeOfContact.toLowerCase() === 'originator') ? name.toLowerCase().replace(/[êéè() ]/g, function(match) {return {"ê": "e", "é": "e", "è": "e", "(": "", ")": "", " ":""}[match];}) + '.png' : '',
                        role: tokens[0],
                        name: name
                    });
                    addedContacts.push(name);
                }
            }
        }
        return contact;
    }
    
    function getLinks(v, record){
    	var links = [];
        if (record.link) {
        	for (i = 0; i < record.link.length; i++) {
            	var tokens = record.link[i].value.split(separator);
            	links.push({
            		name: tokens[0],
            		title: tokens[1],
            		href: tokens[2] + (tokens[2].indexOf('google.kml') !== -1 ? '&fromWorkspace=' + getWorkspace(v,record) : ''),
            		protocol: tokens[3],
            		type: tokens[4],
            		applicationProfile: (tokens.length>5 ? tokens[5] : '')
            	});
            }
        }
        return links;
    }
    
    /**
     * Some convert function to face empty geonet_info parameters
     * BUG in GeoNetwork when retrieving iso19115 record through CSW
     */
    function getSource(v, record){
        if (record.geonet_info && record.geonet_info.source) {
            return record.geonet_info.source[0].value;
        } else {
            return '';
        }
    }
    
    function getPopularity(v, record){
        if (record.popularity) {
            return record.popularity[0].value;
        } else {
            return '';
        }
    }
    
    function getRating(v, record){
        if (record.rating) {
            return record.rating[0].value;
        } else {
            return '';
        }
    }
    
    function getDownload(v, record){
        if (record.download) {
            return record.download[0].value;
        } else {
            return '';
        }
    }
    
    function getOwnerName(v, record){
        /*if (record.userinfo && record.userinfo[0].value) {
            var userinfo = record.userinfo[0].value.split(separator);
            try {
                return userinfo[2] + " " + userinfo[1]; // User profile + ' (' + OpenLayers.i18n(userinfo[3]) + ')';
			} catch (e) {
				return '';
			}
        } else {
            return '';
        }*/
        if (record.geonet_info && record.geonet_info.ownername) {
            return record.geonet_info.ownername[0].value;
        } else {
            return '';
        }
    }
    
    function getTempExtentBegin(v, record){
        if (record.tempExtentBegin) {
            return record.tempExtentBegin[0].value;
        } else {
            return '';
        }
    }
    
    function getTempExtentEnd(v, record){
        if (record.tempExtentEnd) {
            return record.tempExtentEnd[0].value;
        } else {
            return '';
        }
    }
    
    function getIsTemplate(v, record){
        if (record.isTemplate) {
            return record.isTemplate[0].value;
        } else {
            return 'n';
        }
    }

    function getIsHarvested(v, record){
        if (record.isHarvested) {
            return record.isHarvested[0].value;
        } else {
            return '';
        }
    }
    function getHarvesterType(v, record){
    	// FIXME
        if (record.geonet_info && record.geonet_info.harvestInfo && record.geonet_info.harvestInfo.type) {
            return record.geonet_info.harvestInfo.type[0].value;
        } else {
            return '';
        }
    }
    function getCategory(v, record){
        if (record.category) {
            return record.category;
        } else {
            return '';
        }
    }
    function getChangeDate(v, record){
        if (record.geonet_info && record.geonet_info.changeDate) {
            return record.geonet_info.changeDate[0].value;
        } else {
            return '';
        }
    }
    function getCreateDate(v, record){
        if (record.geonet_info && record.geonet_info.createDate) {
            return record.geonet_info.createDate[0].value;
        } else {
            return '';
        }
    }
    function getSelected(v, record){
        if (record.geonet_info && record.geonet_info.selected) {
            return record.geonet_info.selected[0].value;
        } else {
            return '';
        }
    }
    function getAbstract(v, record){
        if (record['abstract']) {
            return record['abstract'][0].value;
        } else {
            return '';
        }
    }
    function getType(v, record){
        if (record['type']) {
            return record['type'][0].value;
        } else {
            return '';
        }
    }
    function getEdit(v, record){
        if (record.geonet_info && record.geonet_info.edit) {
            return record.geonet_info.edit[0].value;
        } else {
            return 'false';
        }
    }
    function getDisplayOrder(v, record){
        if (record.geonet_info && record.geonet_info.displayOrder) {
            return record.geonet_info.displayOrder[0].value;
        } else {
            return 0;
        }
    }

    function getLocked(v, record){
        if (record.geonet_info && record.geonet_info.isLocked) {
            return record.geonet_info.isLocked[0].value;
        } else {
            return 'n';
        }
    }

    function getWorkspace(v, record){
        if (record.isWorkspace) {
            return record.isWorkspace[0].value;
        } else {
            return 'false';
        }
    }

    function getStatusCode(v, record){
        if (record.geonet_info && record.geonet_info.status) {
            return record.geonet_info.status[0].value;
        } else {
            return '0';
        }
    }

    function getSymbolicLocking(v, record){
        if (record.geonet_info && record.geonet_info.symbolicLocking) {
            if (record.geonet_info.symbolicLocking[0].value == 'enabled') {
                return 'y';
            } else {
                return 'n';
            }
        } else {
            return 'n';
        }
    }

    function getLockedBy(v, record){
        if (record.geonet_info && record.geonet_info.lockedBy) {
            return record.geonet_info.lockedBy[0].value;
        } else {
            return '';
        }
    }

    function getOwner(v, record){
        if (record.geonet_info && record.geonet_info.owner) {
            return record.geonet_info.owner[0].value;
        } else {
            return 'false';
        }
    }


    return new Ext.data.JsonStore({
        totalProperty: 'summary.count',
        root: 'records',
        fast: 'index',
        service: 'q',
        fields: [{
            name: 'title',
            convert: getTitle
        }, {
            name: 'abstract',
            convert: getAbstract
        }, {
            name: 'type',
            convert: getType
        }, {
            name: 'subject',
            mapping: 'keyword',
            defaultValue: ''
        }, {
            name: 'uuid',
            mapping: 'geonet_info.uuid[0].value',
            defaultValue: ''
        }, {
            name: 'id',
            mapping: 'geonet_info.id[0].value',
            defaultValue: ''
        },  {
            name: 'locked',
            convert: getLocked
        }, {
            name: 'workspace',
            convert: getWorkspace
        }, {
            name: 'status',
            convert: getStatusCode
        }, {
            name: 'schema',
            mapping: 'geonet_info.schema[0].value',
            defaultValue: ''
        }, {
            name: 'contact',
            convert: getContact
        }, {
            name: 'thumbnail',
            convert: getThumbnails
        }, {
            name: 'links',
            convert: getLinks
        }, {
            name: 'uri',
            mapping: 'uri',
            defaultValue: ''
        }, {
            name: 'istemplate',
            convert: getIsTemplate
        }, {
            name: 'isharvested',
            convert: getIsHarvested
        }, {
            name: 'harvestertype',
            convert: getHarvesterType
        }, {
            name: 'createdate',
            convert: getCreateDate
        }, {
            name: 'changedate',
            convert: getChangeDate
        }, {
            name: 'selected',
            convert: getSelected
        }, {
            name: 'source',
            convert: getSource
        }, {
            name: 'category',
            convert: getCategory
        }, {
            name: 'rating',
            convert: getRating
        }, {
            name: 'popularity',
            convert: getPopularity
        }, {
            name: 'download',
            convert: getDownload
        }, {
            name: 'ownername',
            convert: getOwnerName
        }, {
            name: 'edit',
            convert: getEdit
        }, {
            name: 'bbox',
            mapping: 'BoundingBox',
            defaultValue: ''
        }, {
            name: 'displayOrder',
            convert: getDisplayOrder,
            sortType: 'asInt'
        }, {
            name: 'valid',
            convert: getValidationInfo
        }, {
            name: 'valid_details',
            convert: getValidationDetails
        }, {
            name: 'symbolicLocking',
            convert: getSymbolicLocking
        }, {
            name: 'lockedBy',
            convert: getLockedBy
        }, {
            name: 'owner',
            convert: getOwner
	    }, {
	        name: 'tempExtentBegin',
	        convert: getTempExtentBegin
		}, {
		    name: 'tempExtentEnd',
		    convert: getTempExtentEnd
		}
        ]
    });
};
