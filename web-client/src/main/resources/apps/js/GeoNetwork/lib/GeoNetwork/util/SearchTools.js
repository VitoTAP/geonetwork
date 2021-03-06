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
Ext.namespace("GeoNetwork.util");

/** api: (define)
 *  module = GeoNetwork.util
 *  class = SearchTools
 */
/** api: example 
 *  GeoNetwork.util.SearchTools is used to build queries from a form and send GET request.
 *  Results could be processed using OpenLayers.Format.GeoNetworkRecord.
 *
 *  GeoNetwork xml.search service is used with KVP search like
 *  http://localhost:8080/geonetwork/srv/fr/xml.search?any=africa&sortBy=relevance&hitsPerPage=10&output=full
 *
 *  .. code-block:: javascript
 *
 *      GeoNetwork.util.SearchTools.doQueryFromForm(this.formId, cat, 1, this.showResults, null, true);
 *      ...
 *      showResults: function(response) {
 *        var getRecordsFormat = new OpenLayers.Format.GeoNetworkRecord();
 *        var r = getRecordsFormat.read(response.responseText);
 *        var values = r.records;
 *        ...
 *      }
 *
 */
GeoNetwork.util.SearchTools = {

    /**
     * Define results mode. "results_with_summary" is used to have GeoNetwork
     * specific result mode.
     */
    fast: 'false',
    output: 'full',
    sortBy: 'relevance',
    hitsPerPage: '50',
    
    
    /** api:method[doQuery]
     *
     *  :param query: ``String``  the KVP query
     *  :param cat: ``GeoNetwork.Catalogue``    Catalogue to query
     *  :param recordNum: ``Number``    Optional start record number
     *  :param onSuccess: ``Function``  Optional function to trigger in case of success
     *  :param onFailure: ``Function``  Optional function to trigger in case of failure
     *  :param updateStore: ``Boolean``    true to update catalogue attached stores. false
     *    to not update them. If false, usually a onSuccess function is used to retrieve
     *    search results.
     *  :param async: ``Boolean``   false to run in synchrone mode. Default is true.
     *  :param noShowMessage: ``Boolean``   false to not show message of no records found.
     *  
     *  Send a GET query to server url. A query is a KVP string.
     *
     */
    doQuery: function(query, cat, startRecord, onSuccess, onFailure, updateStore, metadataStore, summaryStore, async, noShowMessage){
/*
    	Ext.Msg.prompt("Query to execute",
    			cat.services.rootUrl + metadataStore.service + "?" + query,
			);
*/
		var scope = Ext.getCmp("GNtabs");

        if (scope!=null) {
        	if (!scope.loadingMask) {
	            scope.loadingMask = new Ext.LoadMask(scope.getEl(), {
	                msg: OpenLayers.i18n('searching')
	            });
            } else {
            	scope.loadingMask.msg = OpenLayers.i18n('searching');
            }
	        scope.loadingMask.show();
        }
    	OpenLayers.Request.GET({
            url: cat.services.rootUrl + metadataStore.service + "?" + query,
            async: async === false ? false : true,
            success: function(result){
		        if (scope!=null && scope.loadingMask !== null) {
		            scope.loadingMask.hide();
		        }
                if (updateStore) {
                    /* TODO : improve */
                    var getRecordsFormat = new OpenLayers.Format.GeoNetworkRecords();
                    var currentRecords = getRecordsFormat.read(result.responseText);
                    var values = currentRecords.records;
                    
                    // Only update status if the target metadata store is the catalogue store
                    // Improve, move the status update on the data change event TODO
                    var isCatalogueMdStore = cat.metadataStore === metadataStore, 
                    	isCatalogueSStore = cat.summaryStore === summaryStore;

                    if (values.length > 0) {

                        metadataStore.on('load', function(store, records){
                            Ext.each(records, function(r, idx){

                                // Check if better place for this??
                                var isAdmin = (cat.identifiedUser) && (cat.identifiedUser.role === 'Administrator');
                                var sameLockedByAndLoggedUser = (cat.identifiedUser) && (r.get('lockedBy') === cat.identifiedUser.id);
                                var isLocked = (r.get('locked') == 'y');
                                var canUnlock = (isLocked && (isAdmin || sameLockedByAndLoggedUser)) ;

                                var isEditable = r.get('edit') === 'true' ? 
                                // do not allow edit on harvested records by default
                                (r.get('isharvested') === 'y' ? GeoNetwork.Settings.editor.editHarvested || false : true) 
                                : 
                                false;

                                var canEdit = ((isLocked && sameLockedByAndLoggedUser) || (!isLocked && isEditable));

                                r.set('userauthenticated', (cat.identifiedUser?'y':'n'));

                                r.set('canunlock', (canUnlock?'y':'n'));
                                r.set('canedit', (canEdit?'y':'n'));

                            }, this);

                        });

                        metadataStore.loadData(currentRecords);

                        // AGIV: Applying the previous callback applies again the templates. Refresh the rating widget.
                        var ratingWidgets = Ext.DomQuery.select('div.rating'), idx;
                        for (idx = 0; idx < ratingWidgets.length; ++idx) {
                            if (Ext.ux.RatingItem && GeoNetwork.Settings.ratingEnabled) {
                                var ri = new Ext.ux.RatingItem(ratingWidgets[idx], {
                                    disabled: true,
                                    name: 'rating' + idx
                                });
                            } else {
                                ratingWidgets[idx].style.display = 'none';
                            }
                        }


                    } else {
                    	if (!noShowMessage) {
                    	 	Ext.Msg.alert("Zoeken", OpenLayers.i18n('noReordsFound'));
                	 	}
                    }                    
                    
                    if (isCatalogueSStore) {
	                    var summary = currentRecords.summary;
                        // added check for summary.keywords.keyword otherwise if result has no keywords the loadData on store fails
                        if (summary && summary.count > 0 && summary.keywords.keyword && summaryStore) {
	                        summaryStore.loadData(summary);
	                    }
                    }
                    
                    if (cat && isCatalogueMdStore) {
                        cat.updateStatus(currentRecords.from + '-' + currentRecords.to +
                                            OpenLayers.i18n('resultBy') +
                                            summary.count);
                    }
                }
                
                if (onSuccess) {
                    onSuccess(result, query);
                }
            },
            failure: function(response){
		        if (scope!=null && scope.loadingMask !== null) {
		            scope.loadingMask.hide();
		        }
                if (onFailure) {
                    onFailure(response);
                }
            }
        });
    },
    /** api:method[doQueryFromForm]
     *
     *  :param formId: ``String``  Form identifier
     *  :param cat: ``GeoNetwork.Catalogue``    Catalogue to query
     *  :param recordNum: ``Number``    Optional start record number
     *  :param onSuccess: ``Function``  Optional function to trigger in case of success
     *  :param onFailure: ``Function``  Optional function to trigger in case of failure
     *  :param updateStore: ``Boolean``    true to update catalogue attached stores. false
     *    to not update them. If false, usually a onSuccess function is used to retrieve
     *    search results.
     *
     *  Build a GET query. A form is composed of one
     *  or more fields which are processed by buildQueryFromForm.
     *
     */
    doQueryFromForm: function(formId, cat, startRecord, onSuccess, onFailure, updateStore, metadataStore, summaryStore, async){
    
        var query = GeoNetwork.util.SearchTools.buildQueryFromForm(Ext.getCmp(formId), startRecord, GeoNetwork.util.SearchTools.sortBy, metadataStore.fast);
        GeoNetwork.util.SearchTools.doQuery(query, cat, startRecord, onSuccess, onFailure, updateStore, metadataStore, summaryStore, async);
    },
    doQueryFromParams: function(params, cat, startRecord, onSuccess, onFailure, updateStore, metadataStore, summaryStore, async){
        var filters = [], query;
        GeoNetwork.util.SearchTools.addFiltersFromPropertyMap(params, filters, startRecord);
        
        query = GeoNetwork.util.SearchTools.buildQueryGET(filters, startRecord, 
                    GeoNetwork.util.SearchTools.sortBy, metadataStore.fast);
        
        GeoNetwork.util.SearchTools.doQuery(query, cat, startRecord, onSuccess, onFailure, updateStore, metadataStore, summaryStore, async);
    },
    /** api:method[buildQueryFromForm]
     *
     *  :param formId: ``String``  Form identifier
     *  :param cat: ``GeoNetwork.Catalogue``    Catalogue to query
     *  :param recordNum: ``Number``    Optional start record number
     *  :param onSuccess: ``Function``  Optional function to trigger in case of success
     *  :param onFailure: ``Function``  Optional function to trigger in case of failure
     *
     *  It's assumed the field name follow a convention. It starts with a letter,
     *  followed by an underscore. The letters are:
     *
     *  * E: no meaning.
     *
     *  In order to define search fuzziness, add a hidden field named E_similarity
     *  with the default similarity to be used in Lucene search.
     *
     */
    buildQueryFromForm: function(form, startRecord, sortBy, fast){
        var values = GeoNetwork.util.SearchTools.getFormValues(form);
        var filters = [];
        
        GeoNetwork.util.SearchTools.addFiltersFromPropertyMap(values, filters, startRecord);
        
        
        return GeoNetwork.util.SearchTools.buildQueryGET(filters, startRecord, sortBy, fast);
    },
    /** api:method[populateFormFromParams]
     *
     *  :param formId: ``String``  Form identifier
     *  :param map: ``Object``    List of parameters in a map.
     *
     *  Populate form fields based on a list of parameters.
     *  Parameters name must be equal to field name.
     *  Prefix E_ could be ommitted.
     *
     *  Search field may not be visible if in a collapsed fieldset (TODO)
     *  Test with radio, dates and geometry (TODO)
     */
    populateFormFromParams: function(form, map){
        form.cascade(function(cur){
            if (cur.getName) {
                var name = cur.getName();
                if (name.indexOf('_') !== -1) { // if URL field name contains prefix (eg. E_)
                    name = name.substring(2);
                    if (map[name]) {
                        // Set form field value
                        cur.setValue(map[name]);
                        
                        // register on store load event to set value after store loaded
                        if (cur.getXType() === 'superboxselect') {
                            cur.store.on('load', function (){
                                cur.setValue(map[name]);
                            });
                        }
                    }
                } else if (map[name]) {
                    cur.setValue(map[name]);
                }
            }
        });
    },
    
    /** private: method[addFiltersFromPropertyMap]
     *  Add property in a GeoNetwork filter
     *  Check for similarity and set up start and end index of records to returned.
     */
    addFiltersFromPropertyMap: function(values, filters, startRecord){
        var defaultSimilarity = ".8", 
            key, 
            similarity = values.E_similarity, 
            hits = values.E_hitsperpage;
        
        // Add the similarity if defined
        if (similarity !== undefined) {
            defaultSimilarity = values.E_similarity;
            GeoNetwork.util.SearchTools.addFilter(filters, 'E_similarity', defaultSimilarity);
        }
        
        if (!hits) {
            hits = GeoNetwork.util.SearchTools.hitsPerPage;
        }
        var to = parseInt(startRecord, 10) + parseInt(hits, 10) - 1;
        GeoNetwork.util.SearchTools.addFilter(filters, 'E_from', startRecord);
        GeoNetwork.util.SearchTools.addFilter(filters, 'E_to', to);
        
        
        // Add all other criteria
        for (key in values) {
            if (values.hasOwnProperty(key)) {
                var value = values[key];
                if (value !== "" && key !== 'E_similarity') {
                    GeoNetwork.util.SearchTools.addFilter(filters, key, value);
                }
            }
        }
    },
    
    /** private: method[addFilter]
     *
     */
    addFilter: function(filters, key, value){
        var field = key.match("^(\\[?)([^_]+)_(.*)$"), 
            i, 
            or = [];
        if (field) {
            var list = field[3].split('|');
            for (i = 0; i < list.length; ++i) {
                GeoNetwork.util.SearchTools.addFilterImpl(filters, field[2], list[i], value);
            }
        }
    },
    
    /** private: method[addFilterImpl]
     *  Build filter according to type name define by form fields name.
     *
     *  TODO : do we need to add wildcard query ?
     */
    addFilterImpl: function(filters, type, name, value){
        if (type.charAt(0) === 'E') { // equals
		    if (typeof(value) == 'object') {
				 for (var i=0; i< value.length; i++) {
				     filters.push(name + "=" + encodeURIComponent(value[i]) + "");
				 }
		    } else {
				filters.push(name + "=" + encodeURIComponent(value) + "");
		    }
//            filters.push(name + "=" + encodeURIComponent(value) + "");
        } else if (type === 'B') { //boolean
            filters.push(name + "=" + (value ? 'on' : 'off') + "");
        } else if (type === 'O') { //optional boolean
            if (value) {
                filters.push(name + "=" + 'on');
            }
        } else {
            alert("Cannot parse " + type);
        }
    },
    
    /** private: method[addFiltersFromPropertyMap]
     *  Define default sort order to use for each kind of sort field.
     */
    sortByMappings: {
        relevance: {
            name: 'relevance',
            order: ''
        },
        rating: {
            name: 'changeDate',
            order: ''
        },
        popularity: {
            name: 'popularity',
            order: ''
        },
        date: {
            name: 'date',
            order: ''
        },
        title: {
            name: 'title',
            order: 'reverse'
        }
    },
    /** private: method[buildQueryGET]
     *  Build a GET query based on an OGC filter.
     */
    buildQueryGET: function(filter, startRecord, sortBy, fast){
    	var query = "fast=" + (fast ? fast : GeoNetwork.util.SearchTools.fast) + "&";
        
//        if (sortBy) {
//            // TODOvar searchInfo = GeoNetwork.util.SearchTools.sortByMappings[sortBy];
//            // result.sortBy = searchInfo.name + ":" + searchInfo.order;
//        }
        
        if (filter) {
            query += filter.join("&");
        }
        
        return query;
    },
    
    /** api: method[getFormValues]
     *  According to field type, get form values.
     */
    getFormValues: function(form){
        var result = /*form.getForm().getValues() ||*/ {};
    	var bSkipThemekey = false;
        
        form.cascade(function(cur){
            if (cur.disabled !== true && /*cur.rendered*/ !(cur.getName && OpenLayers.String.startsWith(cur.getName(),'ext-comp'))) { // Check element is
                // enabled
                // and rendered (ie. visible, eg. field in a collapsed fieldset)
                if (cur.isXType('boxselect')) {
                    if (cur.getValue && cur.getValue()) {
                        result[cur.getName()] = cur.getValue();
                    }
                } else if (cur.isXType('combo')) {
                    if (cur.getValue && cur.getValue()) {
                        if (cur.id === "E_any") {
                            result[cur.getName()] = "*" + cur.getValue() + "*";
                        } else if (cur.id === "E_flanderskeyword") {
                        	var themekeyValue = result["E_themekey"];
                        	var flanderskeywordValue = result["E_flanderskeyword"];
                        	if (flanderskeywordValue.length > 0) {
                        		if (themekeyValue.length > 0) {
		                        	result["E_themekey"] = ((Ext.isArray(themekeyValue) ? themekeyValue.join(" or ") : themekeyValue) + " or " + cur.getValue()).toLowerCase();  
	                        	} else {
	                        		var value = cur.getValue().toLowerCase();
	                        		result["E_themekey"] = (value.indexOf(" or ") > -1) ? value : (value.split ? '"' + value + '"' : value); 
	                        	}
	                        	bSkipThemekey = true;
	                        	result["E_flanderskeyword"] = "";
                        	}
                        } else {
                        	if (cur.id != "E_themekey" || !bSkipThemekey) {
	                            var value = cur.getValue();
	                            // Check if value is a string or an array
	                            if (value.split) {
	                                // Use phase query
	                                if (value.split(" ").length > 1) {
		                                result[cur.getName()] = (value.indexOf(" or ") > -1) ? value : '"' + value + '"';
	                                } else {
	                                    result[cur.getName()] = value;
	                                }
	                            } else {
                                    result[cur.getName()] = value;
								}
							}
                        }
                    }
                } else if (cur.isXType('fieldset')) {
                    if (cur.checkbox) {
                        /* support for checkboxes in the fieldset title */
                        result[cur.checkboxName] = !cur.collapsed;
                    }
                } else if (cur.isXType('radiogroup')) {
                    /*
                     * a radiogroup is not a container. So cascade doesn't
                     * visit it... don't ask...
                     */
                    var first = cur.items.get(0);
                    result[first.getName()] = first.getGroupValue();
                } else if (cur.isXType('checkbox')) {
                	if (cur.getRawValue() != 'on') { // inputValue has been set explicitly: insert if selected, ignore if not
                		if (cur.getValue()) {
                			result[cur.getName()] = cur.getRawValue();
                		} 
                	} else {
                		result[cur.getName()] = cur.getValue();
                	}
                } else if (cur.isXType('datefield')) {
                    if (cur.getValue() !== "") {
                        result[cur.getName()] = cur.getValue().format('Y-m-d') +
                        (cur.postfix ? cur.postfix : '');
                    }
                } else if (cur.getName) {
                    if (cur.getValue && cur.getValue() !== "") {
/*
                    	var value = cur.getValue();
                        if (value.split(" ").length > 1) {
                            result[cur.getName()] = (value.indexOf(" or ") > -1) ? value : '"' + value + '"';
                        } else {
                            result[cur.getName()] = value;
                        }
*/
                    	GeoNetwork.util.SearchTools.addFieldValue(result, cur.getName(), cur.getValue());
                    }
                }
            }
            return true;
        });
        return result;
    },			
    addFieldValue: function (result, name, value) {
        if (value.split(" ").length > 1) {
            value = (value.indexOf(" or ") > -1) ? value : '"' + value + '"';
        }
        if (result[name] === undefined) {
            result[name] = new Array(value);
        } else {
            result[name].push(value);
        }
    }
};
