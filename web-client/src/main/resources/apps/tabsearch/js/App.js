Ext.namespace('GeoNetwork');

var catalogue;
var app;

var mapTabAccessCount = 0;

GeoNetwork.app = function() {
	// private vars:
	var geonetworkUrl;
	var searching = false;
	var editorWindow;
	var editorPanel;
	var cookie;

	/**
	 * Application parameters are : * any search form ids (eg. any) * mode=1 for
	 * visualization * advanced: to open advanced search form by default *
	 * search: to trigger the search * uuid: to display a metadata record based
	 * on its uuid * extent: to set custom map extent
	 */
	var urlParameters = {};
	/**
	 * Catalogue manager
	 */
	var catalogue;

	/**
	 * An interactive map panel for data visualization
	 */
	var iMap;

	var searchForm;

	var facetsPanel;

	var resultsPanel;

	var metadataResultsView;

	var tBar, bBar;

	var mainTagCloudViewPanel, tagCloudViewPanel, infoPanel;

	var visualizationModeInitialized = false;

	var searchFirstTime = false;

	/**
	 * Create a mapControl
	 * 
	 * @return
	 */

	function initMap() {
		iMap = new GeoNetwork.mapApp();
		var layers = {}, options = {};
		if (GeoNetwork.map.CONTEXT || GeoNetwork.map.OWS) {
			options = GeoNetwork.map.CONTEXT_MAIN_MAP_OPTIONS;
		} else {
			options = GeoNetwork.map.MAIN_MAP_OPTIONS;
			layers = GeoNetwork.map.BACKGROUND_LAYERS;
		}
		iMap.init(layers, options);
		metadataResultsView.addMap(iMap.getMap(), true);
		visualizationModeInitialized = true;
		return iMap;
	}

	/**
	 * Create a language switcher mode
	 * 
	 * @return
	 */
	function createLanguageSwitcher(lang) {
		return new Ext.form.FormPanel({
			renderTo : 'lang-form',
			width : 80,
			border : false,
			layout : 'hbox',
			hidden : GeoNetwork.Util.locales.length === 1 ? true : false,
			items : [ new Ext.form.ComboBox({
				mode : 'local',
				triggerAction : 'all',
				width : 80,
				store : new Ext.data.ArrayStore({
					idIndex : 2,
					fields : [ 'id', 'name', 'id2' ],
					data : GeoNetwork.Util.locales
				}),
				valueField : 'id2',
				displayField : 'name',
				value : lang,
				listeners : {
					select : function(cb, record, idx) {
						window.location.replace('?hl=' + cb.getValue());
					}
				}
			}) ]
		});
	}

	/**
	 * Create a default login form and register extra events in case of error.
	 * 
	 * @return
	 */
	function createLoginForm(/* user */) {
		// Store user info in cookie to be displayed if user reload the page
		// Register events to set cookie values
		catalogue.on('afterLogin', function() {
			var cookie = Ext.state.Manager.getProvider();
			cookie.set('user', catalogue.identifiedUser);
		});
		catalogue.on('afterLogout', function() {
			var cookie = Ext.state.Manager.getProvider();
			cookie.set('user', undefined);
		});

		var loginForm = new GeoNetwork.LoginForm({
			renderTo : 'login-form',
			catalogue : catalogue,
			layout : 'column',
			bodyStyle : {
				"background-color" : "transparent"
			},
			hideLoginLabels : GeoNetwork.hideLoginLabels
		});

		catalogue.on('afterBadLogin', loginAlert, this);
	}

	/**
	 * Error message in case of bad login
	 * 
	 * @param cat
	 * @param user
	 * @return
	 */
	function loginAlert(cat, user) {
		Ext.Msg.show({
			title : 'Login',
			msg : 'Login failed. Check your username and password.',
			/* TODO : Get more info about the error */
			icon : Ext.MessageBox.ERROR,
			buttons : Ext.MessageBox.OK
		});
	}

	function getResultsMap() {
		// Create map panel
		var map = new OpenLayers.Map('results_map', GeoNetwork.map.MAP_OPTIONS);
		map.addLayers(GeoNetwork.map.BACKGROUND_LAYERS);
		// map.zoomToMaxExtent();

		mapPanel = new GeoExt.MapPanel({
			title : OpenLayers.i18n('mapPanelTitle'),
			id : "resultsMap",
			height : 100,
			width : 200,
			map : map
		});

		return mapPanel;

		// TODO: Add in a widget
		// return new GeoNetwork.map.SeachResultsMap();
	}

	/**
	 * Create a default search form with advanced mode button
	 * 
	 * @return
	 */
	function createSearchForm(user) {
		// Add advanced mode criteria to simple form - start
		var advancedCriteria = [];
		var advancedCriteriaExtra = [];
		var services = catalogue.services;
		var uuidField = new GeoNetwork.form.OpenSearchSuggestionTextField({
			hideLabel : false,
			field : '_uuid',
			name : 'E__uuid',
			fieldLabel : OpenLayers.i18n("uuid"),
			anchor : '100%',
			style : {
				height : '29px'
			},
			minChars : 1,
			loadingText : '...',
			hideTrigger : true,
			url : catalogue.services.opensearchSuggest
		});

		// Multi select organisation field
		var orgNameStore = new GeoNetwork.data.OpenSearchSuggestionStore({
			url : services.opensearchSuggest,
			rootId : 1,
			baseParams : {
				field : 'orgName'
			}
		});

		var tpl = '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.value}">{values.value}</div></tpl>';
		var displayFieldTpl = '<tpl for="."><span ext:qtip="{values.value}">{values.value}</span></tpl>';
		var orgNameField = new Ext.ux.form.SuperBoxSelect({
			hideLabel : false,
			minChars : 0,
			queryParam : 'q',
			hideTrigger : false,
			id : 'E_orgName',
			name : 'E_orgName',
			store : orgNameStore,
			valueField : 'value',
			displayField : 'value',
			valueDelimiter : ' or ',
			displayFieldTpl : displayFieldTpl,
			tpl : tpl,
			fieldLabel : OpenLayers.i18n('org')
		});

		// Multi select keyword
		var themekeyStore = new GeoNetwork.data.OpenSearchSuggestionStore({
			url : services.opensearchSuggest,
			rootId : 1,
			baseParams : {
				field : 'keyword'
			}
		});
		var themekeyField = new Ext.ux.form.SuperBoxSelect({
			hideLabel : false,
			minChars : 0,
			queryParam : 'q',
			hideTrigger : false,
			id : 'E_themekey',
			name : 'E_themekey',
			store : themekeyStore,
			valueField : 'value',
			displayField : 'value',
			valueDelimiter : ' or ',
			displayFieldTpl : displayFieldTpl,
			tpl : tpl,
			fieldLabel : OpenLayers.i18n('keyword')
		});

		var when = new Ext.form.FieldSet({
			title : OpenLayers.i18n('when'),
			autoWidth : true,
			// layout: 'row',
			defaultType : 'datefield',
			collapsible : true,
			collapsed : true,
			items : GeoNetwork.util.SearchFormTools.getWhen()
		});

		var ownerField = new Ext.form.TextField({
			id : 'E__owner',
			name : 'E__owner',
			hidden : true
		});
		var statusField = GeoNetwork.util.SearchFormTools.getStatusField(
				services.getStatus, true);
		var isHarvestedField = new Ext.form.TextField({
			name : 'E__isHarvested',
			hidden : true
		});

		var isLockedField = new Ext.form.TextField({
			name : 'E__isLocked',
			hidden : true
		});
		// var flandersKeywordField =
		// GeoNetwork.util.SearchFormTools.getFlandersKeywordField(catalogue.services,
		// true);
		var myMetadata = new Ext.form.Checkbox({
			fieldLabel : OpenLayers.i18n('myMetadata'),
			handler : function(ck, checked) {
				if (checked && catalogue.identifiedUser) {
					Ext.getCmp('E__owner')
							.setValue(catalogue.identifiedUser.id);
				} else {
					Ext.getCmp('E__owner').setValue('');
				}
			}
		});

		var catalogueField = GeoNetwork.util.SearchFormTools.getCatalogueField(
				services.getSources, services.logoUrl, true);
		var groupField = GeoNetwork.util.SearchFormTools.getGroupField(
				services.getGroups, true);
		var metadataTypeField = GeoNetwork.util.SearchFormTools
				.getMetadataTypeField(true);
		// Disabled for AGIV
		// var categoryField =
		// GeoNetwork.util.SearchFormTools.getCategoryField(services.getCategories,
		// '../images/default/category/', true);
		var validField = GeoNetwork.util.SearchFormTools.getValidField(true);
		var validXSDField = GeoNetwork.util.SearchFormTools
				.getValidXSDField(true);
		var validISOSchematronField = GeoNetwork.util.SearchFormTools
				.getValidIsoSchematronField(true);
		var validInspireSchematronField = GeoNetwork.util.SearchFormTools
				.getValidInspireSchematronField(true);
		var validAGIVSchematronField = GeoNetwork.util.SearchFormTools
				.getValidAGIVSchematronField(true);
		var spatialTypes = GeoNetwork.util.SearchFormTools
				.getSpatialRepresentationTypeField(null, true);
		var denominatorField = GeoNetwork.util.SearchFormTools
				.getScaleDenominatorField(true);

		// Disabled for AGIV
		// advancedCriteria.push(themekeyField, orgNameField, categoryField,
		advancedCriteria.push(/* flandersKeywordField, */themekeyField,
				uuidField, orgNameField/*
										 * , spatialTypes, denominatorField
										 */);
		if (GeoNetwork.Settings.nodeType.toLowerCase() != "agiv") {
			advancedCriteria.push(catalogueField);
		}
		advancedCriteriaExtra.push(groupField, statusField, ownerField,
				isHarvestedField, isLockedField);

		// Hide or show extra fields after login event
		var loggedInFields = [ statusField, groupField, myMetadata ];
		Ext.each(loggedInFields, function(item) {
			item.setVisible(user && !Ext.isEmpty(user.role));
		});

		var reviewerFields = [ metadataTypeField ];
		Ext
				.each(
						reviewerFields,
						function(item) {
							item
									.setVisible(user
											&& (user.role == 'Hoofdeditor' || user.role == 'Administrator'));
						});
		var adminFields = [/*
							 * , validField, validXSDField,
							 * validISOSchematronField,
							 * validInspireSchematronField,
							 * validAGIVSchematronField
							 */];
		Ext.each(adminFields, function(item) {
			item.setVisible(user && user.role == 'Administrator');
		});

		catalogue
				.on(
						'afterLogin',
						function() {
							var user = Ext.state.Manager.getProvider().get(
									'user');
							Ext.each(loggedInFields, function(item) {
								item
										.setVisible(user
												&& !Ext.isEmpty(user.role));
							});
							Ext
									.each(
											reviewerFields,
											function(item) {
												item
														.setVisible(user
																&& (user.role == 'Hoofdeditor' || user.role == 'Administrator'));
											});
							Ext.each(adminFields, function(item) {
								item.setVisible(user
										&& user.role == 'Administrator');
							});
							GeoNetwork.util.SearchFormTools.reload(this);
							Ext.getCmp('searchForm').doLayout();

							Ext.getCmp('E__owner').setValue('');
						});
		catalogue.on('afterLogout', function() {
			Ext.each(loggedInFields, function(item) {
				item.setVisible(false);
			});
			Ext.each(reviewerFields, function(item) {
				item.setVisible(false);
				Ext.getCmp('searchForm').getForm().reset();
			});
			Ext.each(adminFields, function(item) {
				item.setVisible(false);
			});
			GeoNetwork.util.SearchFormTools.reload(this);
			Ext.getCmp('searchForm').doLayout();

			myMetadata.setValue(false);
			Ext.getCmp('E__owner').setValue('');
		});
		var hitsPerPage = [ [ '10' ], [ '20' ], [ '50' ], [ '100' ] ];
		var hitsPerPageField = new Ext.form.ComboBox({
			id : 'E_hitsperpage',
			name : 'E_hitsperpage',
			mode : 'local',
			triggerAction : 'all',
			fieldLabel : OpenLayers.i18n('hitsPerPage'),
			value : hitsPerPage[1], // Set default value to 50
			store : new Ext.data.ArrayStore({
				id : 0,
				fields : [ 'id' ],
				data : hitsPerPage
			}),
			valueField : 'id',
			displayField : 'id'
		});

		var hideInspirePanel = catalogue.getInspireInfo().enable == "false";
		return new Ext.FormPanel(
				{
					id : 'searchForm',
					// bodyStyle: 'text-align: center;',
					layout : 'column',
					border : false,
					columns : 3,
					autoHeight : true,
					autoScroll : true,
					// autoShow : true,
					items : [
							new GeoNetwork.form.OpenSearchSuggestionTextField({
								width : 100,
								anchor : '100%',
								border : false,
								columnWidth : 0.70,
								minChars : 2,
								loadingText : '...',
								hideTrigger : true,
								url : catalogue.services.opensearchSuggest
							}),
							new Ext.Button(
									{
										// text: OpenLayers.i18n('search'),
										id : 'searchBt',
										margins : '3 5 3 5',
										border : false,
										height : '28px',
										columnWidth : 0.15,
										icon : '../js/GeoNetwork/resources/images/default/find.png',
										// FIXME : iconCls : 'md-mn-find',
										iconAlign : 'right',
										listeners : {
											click : function() {
												var any = Ext.get('E_any');
												if (any) {
													if (any.getValue() === OpenLayers
															.i18n('fullTextSearch')) {
														any.setValue('');
													}
												}
												catalogue.startRecord = 1; // Reset
												// start
												// record
												search();
												setTab('results');
											}
										}
									}),
							new Ext.Button({
								// text: OpenLayers.i18n('reset'),
								tooltip : OpenLayers.i18n('resetSearchForm'),
								// iconCls: 'md-mn-reset',
								id : 'resetBt',
								margins : '3 5 3 5',
								border : false,
								height : '28px',
								columnWidth : 0.15,
								icon : '../images/default/cross.png',
								iconAlign : 'right',
								listeners : {
									click : function() {
										facetsPanel.reset();
										Ext.getCmp('searchForm').getForm()
												.reset();
										statusField.store.reload();
										Ext.getCmp('searchBt').fireEvent(
												'click');
									}
								}
							}),
							metadataTypeField,
							{
								title : 'Options',
								width : 0,
								autoHeight : true,
								hidden : true,
								items : [
										GeoNetwork.util.SearchFormTools
												.getSortByCombo(),
										hitsPerPageField ]
							}, {
								border : false,
								columnWidth : 1,
								html : '<div id="facets" class="facets"></div>'
							} ]
				});
	}

	function search() {
		searching = true;
		catalogue.search('searchForm', app.loadResults, null,
				catalogue.startRecord, true);
	}

	function searchWithSitekeyword(value) {
		/*
		 * var sitekeywordField = Ext.getCmp('E_sitekeyword'); if
		 * (!sitekeywordField) { sitekeywordField = searchForm.insert(0, new
		 * Ext.form.TextField({ id: 'E_sitekeyword', name: 'E_sitekeyword',
		 * inputType: 'hidden' })); } catalogue.startRecord = 1; // Reset start
		 * record sitekeywordField.setValue(value); search(); setTab('results');
		 */
		// facetsPanel.removeFacet('facet_0',true);
		facetsPanel.reset();
		facetsPanel.addFacet(0, {
			id : 'facet_0',
			facet : 'sitekeyword',
			value : value,
			label : value,
			bcid : 'bc_facet_0',
			fieldid : 'field_facet_0'
		});
	}

	function initPanels() {
		// var //infoPanel = Ext.getCmp('infoPanel'),
		var resultsPanel = Ext.getCmp('resultsPanel');
		// tagCloudPanel = Ext.getCmp('tagCloudPanel');
		if (!resultsPanel.isVisible()) {
			resultsPanel.show();
		}

		// Init map on first search to prevent error
		// when user add WMS layer without initializing
		// Visualization mode
		// if (GeoNetwork.MapModule && !visualizationModeInitialized) {
		// initMap();
		// }
	}
	/**
	 * Bottom bar
	 * 
	 * @return
	 */
	function createBBar() {

		var previousAction = new Ext.Action({
			id : 'previousBt',
			text : '&lt;&lt;',
			handler : function() {
				var from = catalogue.startRecord
						- parseInt(Ext.getCmp('E_hitsperpage').getValue(), 10);
				if (from > 0) {
					catalogue.startRecord = from;
					search();
				}
			},
			scope : this
		});

		var nextAction = new Ext.Action({
			id : 'nextBt',
			text : '&gt;&gt;',
			handler : function() {
				catalogue.startRecord += parseInt(Ext.getCmp('E_hitsperpage')
						.getValue(), 10);
				search();
			},
			scope : this
		});

		return new Ext.Toolbar({
			items : [ previousAction, '|', nextAction, '|', {
				xtype : 'tbtext',
				text : '',
				id : 'info'
			} ]
		});

	}

	/**
	 * Results panel layout with top, bottom bar and DataView
	 * 
	 * @return
	 */
	function createResultsPanel() {
		metadataResultsView = new GeoNetwork.MetadataResultsView({
			catalogue : catalogue,
			displaySerieMembers : true,
			border : false,
			frame : false,
			layout : 'fit',
			bodyStyle : 'padding:5px',
			autoHeight : true,
			autoWidth : true,
			tpl : GeoNetwork.Templates.FULL
		});

		catalogue.resultsView = metadataResultsView;

		tBar = new GeoNetwork.MetadataResultsToolbar({
			catalogue : catalogue,
			searchBtCmp : Ext.getCmp('searchBt'),
			sortByCmp : Ext.getCmp('E_sortBy'),
			metadataResultsView : metadataResultsView
		});

		bBar = createBBar();

		resultPanel = new Ext.Panel({
			id : 'resultsPanel',
			border : false,
			// frame: false,
			layout : 'fit',
			autoWidth : true,
			// autoHeight: true,
			autoScroll : true,
			hidden : true,
			bodyCssClass : 'md-view',
			tbar : tBar,
			items : metadataResultsView,
			// paging bar on the bottom
			bbar : bBar
		});

		return resultPanel;
	}
	function loadCallback(el, success, response, options) {

		if (success) {
			// createMainTagCloud();
			// createLatestUpdate();
		} else {
			// Ext.get('infoPanel').getUpdater().update({url:'home_en.html'});
			// Ext.get('helpPanel').getUpdater().update({url:'help_en.html'});
		}
	}
	/**
	 * private: methode[creatAboutPanel] Main information panel displayed on
	 * load
	 * 
	 * :return:
	 */
	function creatAboutPanel() {
		return new Ext.Panel({
			border : true,
			id : 'infoPanel',
			baseCls : 'md-info',
			autoWidth : true,
			// contentEl: 'infoContent',
			autoLoad : {
				url : catalogue.services.rootUrl + '/about?modal=true',
				callback : loadCallback,
				scope : this,
				loadScripts : true
			}
		});
	}
	/**
	 * private: methode[createHelpPanel] Help panel displayed on load
	 * 
	 * :return:
	 */
	function createHelpPanel() {
		return new Ext.Panel({
			border : false,
			frame : false,
			bodyStyle : {
				'background-color' : 'white',
				padding : '5px'
			},
			autoScroll : true,
			baseCls : 'none',
			id : 'helpPanel',
			autoWidth : true,
			autoLoad : {
				url : 'help_' + catalogue.LANG + '.html',
				callback : initShortcut,
				scope : this,
				loadScripts : false
			}
		});
	}

	/**
	 * Main tagcloud displayed in the information panel
	 * 
	 * @return
	 */
	function createMainTagCloud() {
		var tagCloudView = new GeoNetwork.TagCloudView({
			catalogue : catalogue,
			query : 'fast=true&summaryOnly=true',
			renderTo : 'tag',
			onSuccess : 'app.loadResults'
		});

		return tagCloudView;
	}
	/**
	 * Create latest metadata panel.
	 */
	function createLatestUpdate() {
		var latestView = new GeoNetwork.MetadataResultsView({
			catalogue : catalogue,
			autoScroll : true,
			tpl : GeoNetwork.Settings.latestTpl
		});
		var latestStore = GeoNetwork.Settings.mdStore();
		latestView.setStore(latestStore);
		latestStore.on('load', function() {
			Ext.ux.Lightbox.register('a[rel^=lightbox]');
		});
		new Ext.Panel({
			border : false,
			bodyCssClass : 'md-view',
			items : latestView,
			renderTo : 'latest'
		});
		catalogue.kvpSearch(GeoNetwork.Settings.latestQuery, null, null, null,
				true, latestView.getStore());
	}
	/**
	 * Extra tag cloud to displayed current search summary TODO : not really a
	 * narrow your search component.
	 * 
	 * @return
	 */
	function createTagCloud() {
		var tagCloudView = new GeoNetwork.TagCloudView({
			catalogue : catalogue
		});

		return new Ext.Panel({
			id : 'tagCloudPanel',
			border : true,
			hidden : true,
			baseCls : 'md-view',
			items : tagCloudView
		});
	}

	function edit(metadataId, create, group, child) {

		if (!this.editorWindow) {
			this.editorPanel = new GeoNetwork.editor.EditorPanel({
				defaultViewMode : GeoNetwork.Settings.editor.defaultViewMode,
				catalogue : catalogue,
				xlinkOptions : {
					CONTACT : true
				}
			});

			this.editorWindow = new Ext.Window({
				/*
				 * tools: [{ id: 'newwindow', qtip:
				 * OpenLayers.i18n('newWindow'), handler: function(e, toolEl,
				 * panel, tc){
				 * window.open(GeoNetwork.Util.getBaseUrl(location.href) +
				 * "#edit=" + panel.getComponent('editorPanel').metadataId);
				 * panel.hide(); }, scope: this }],
				 */
				title : OpenLayers.i18n('mdEditor'),
				id : 'editorWindow',
				layout : 'fit',
				modal : false,
				items : this.editorPanel,
				closeAction : 'close',
				collapsible : false,
				collapsed : false,
				maximized : true,
				resizable : true,
				// constrain: true,
				width : 980,
				height : 800,
				onEsc : Ext.emptyFn
			});

			var this_ = this;
			this.editorWindow.on('destroy', function() {
				this_.editorWindow = undefined;
				this_.editorPanel = undefined;
			});

			this.editorPanel.setContainer(this.editorWindow);

			this.editorPanel.on('editorClosed', function() {
				Ext.getCmp('searchBt').fireEvent('click');
			});
		}

		if (metadataId) {
			if (GeoNetwork.Settings && GeoNetwork.Settings.ga) {
				try {
					ga('send', 'event', 'edit', 'clicked');
				} catch (e) {
				}
			}
			this.editorWindow.show();
			this.editorPanel.init(metadataId, create, group, child);
		}
	}

	function createHeader() {
		var info = catalogue.getInfo();
		Ext.getDom('title').innerHTML = '<a href="http://belair.vgt.vito.be" target="_blank"><img class="catLogo" src="images/logo'
				+ GeoNetwork.Settings.nodeType.toLowerCase()
				+ '.png" title="'
				+ info.name + '"/></a>';
		document.title = info.name;
	}

	// public space:
	return {
		init : function() {
			Ext.Msg.minWidth = 360;
			Ext.MessageBox.minWidth = 360;
			Ext.EventManager.on(window, 'keydown',
					function(e, t) {
						if (e.getKey() == e.BACKSPACE
								&& (/^select$/i.test(t.tagName)
										|| /^body$/i.test(t.tagName)
										|| t.disabled || t.readOnly)) {
							e.stopEvent();
						}
					});

			geonetworkUrl = /* GeoNetwork.URL || */window.location.href.match(
					/(http.*\/.*)\/apps\/tabsearch.*/, '')[1];

			urlParameters = GeoNetwork.Util.getParameters(location.href);
			var lang = urlParameters.hl || GeoNetwork.defaultLocale;
			if (urlParameters.extent) {
				urlParameters.bounds = new OpenLayers.Bounds(
						urlParameters.extent[0], urlParameters.extent[1],
						urlParameters.extent[2], urlParameters.extent[3]);
			}

			// Init cookie
			cookie = new Ext.state.CookieProvider({
				expires : new Date(new Date().getTime()
						+ (1000 * 60 * 60 * 24 * 365))
			});
			Ext.state.Manager.setProvider(cookie);

			// Create connexion to the catalogue
			catalogue = new GeoNetwork.Catalogue(
					{
						statusBarId : 'info',
						lang : lang,
						hostUrl : geonetworkUrl,
						mdOverlayedCmpId : 'resultsPanel',
						adminAppUrl : geonetworkUrl + '/srv/' + lang + '/admin',
						// Declare default store to be used for records and
						// summary
						metadataStore : GeoNetwork.Settings.mdStore ? GeoNetwork.Settings
								.mdStore()
								: GeoNetwork.data.MetadataResultsStore(),
						metadataCSWStore : GeoNetwork.data
								.MetadataCSWResultsStore(),
						summaryStore : GeoNetwork.data.MetadataSummaryStore(),
						editMode : 2, // TODO : create constant
						metadataEditFn : edit
					});
			catalogue.metadataSelectNone();
			createHeader();

			// Top navigation widgets
			// createModeSwitcher();
			// createLanguageSwitcher(lang);
			if (Ext.get("login-form")) {
				createLoginForm(/* user */);
			}
			var user = Ext.state.Manager.getProvider().get('user');
			// Search form
			searchForm = createSearchForm(user);

			edit();

			// Results map
			// resultsMap = getResultsMap();

			// Search result
			resultsPanel = createResultsPanel();

			// Extra stuffs
			// infoPanel = {};//createInfoPanel();
			// helpPanel = createHelpPanel();

			tagCloudViewPanel = createTagCloud();

			// Initialize map viewer
			if (GeoNetwork.MapModule) {
				initMap();
			}

			// Register events on the catalogue

			var margins = '0 0 0 0';

			if (!visualizationModeInitialized)
				initMap();

			var breadcrumb = new Ext.Panel({
				layout : 'column',
				cls : 'breadcrumb',
				defaultType : 'button',
				border : false,
				split : false
			// layoutConfig: {
			// columns:3
			// }
			});
			facetsPanel = new GeoNetwork.FacetsPanel({
				title : OpenLayers.i18n('facetsPanelTitle'),
				border : true,
				searchForm : searchForm,
				breadcrumb : breadcrumb,
				maxDisplayedItems : GeoNetwork.Settings.facetMaxItems || 1000,
				facetListConfig : GeoNetwork.Settings.facetListConfig || [],
				catalogue : catalogue
			});

			var viewport = new Ext.Viewport(
					{
						layout : 'border',
						id : 'vp',
						items : [ // todo: should add header here?
								{
									id : 'header',
									height : 60,
									region : 'north',
									border : false
								},
								new Ext.TabPanel(
										{
											region : 'center',
											id : 'GNtabs',
											deferredRender : false,
											plain : true,
											// autoScroll: true,
											// defaults:{ autoScroll:true },
											margins : '10',
											border : false,
											activeTab : 0,
											items : [
													{// basic search panel
														title : OpenLayers
																.i18n('Home'),
														// contentEl:'dvZoeken',
														layout : 'fit',
														layoutConfig : {
															pack : 'center',
															align : 'center'
														},
														listeners : {
															activate : function() {
																this.doLayout();
															}
														},
														closable : false,
														// autoScroll:true,
														items : // searchForm
														new Ext.Panel(
																{
																	id : 'images-view',
																	plain : true,
																	layout : 'column',
																	layoutConfig : {
																		pack : 'center',
																		align : 'center'
																	},
																	autoHeight : true,
																	boxMinWidth : 1000,
																	bodyStyle : 'border-width:0px',
																	border : true,
																	deferredRender : false,
																	defaults : {
																		style : 'padding:50px;text-align:center;font-size:20px',
																		bodyStyle : 'padding:5px'
																	},
																	items : [
																			{
																				border : false,
																				columnWidth : 0.2
																			},
																			{
																				xtype : 'box',
																				border : false,
																				columnWidth : 0.6,
																				autoEl : {
																					html : '<div style="border: 1px solid #203612;"><div style="height: 500px;" id="sitesmap"></div><div style="background-color: #7AA7BE; height: 20px;"></div><div style="background-color: #1E6A91; height: 40px; padding-top: 10px;"><p style="color: #FFF;">Search a site on the map</p></div></div>'
																				},
																				listeners : {
																					render : function(
																							p) {
																						p
																								.getEl()
																								.on(
																										'click',
																										function() {
																											// searchWithRegionkeyword("global");
																										});
																					},
																					single : true
																				}
																			},
																			{
																				border : false,
																				columnWidth : 0.2
																			} ]
																/*
																 * items:[ {
																 * border:
																 * false,
																 * columnWidth:
																 * 0.15 }, {
																 * xtype: 'box',
																 * border:
																 * false,
																 * columnWidth:
																 * 0.25, autoEl :
																 * {html:'<div
																 * class="thumb"><img
																 * style="cursor:pointer;height:150px"
																 * src="' +
																 * catalogue.URL +
																 * '/apps/tabsearch/images/litora.png"
																 * title="LITORA"
																 * alt="LITORA"></div><br/><div>LITORA</div>'},
																 * listeners: {
																 * render:
																 * function(p) {
																 * p.getEl().on('click',
																 * function(){
																 * searchWithSitekeyword("litora");
																 * }); },
																 * single: true } }, {
																 * xtype: 'box',
																 * border:
																 * false,
																 * columnWidth:
																 * 0.20, autoEl :
																 * {html:'<div
																 * class="thumb"><img
																 * style="cursor:pointer;height:150px"
																 * src="' +
																 * catalogue.URL +
																 * '/apps/tabsearch/images/sonia.png"
																 * title="SONIA"
																 * alt="SONIA"></div><br/><div>SONIA</div>'},
																 * listeners: {
																 * render:
																 * function(p) {
																 * p.getEl().on('click',
																 * function(){
																 * searchWithSitekeyword("sonia");
																 * }); },
																 * single: true } }, {
																 * xtype: 'box',
																 * border:
																 * false,
																 * columnWidth:
																 * 0.25, autoEl :
																 * {html:'<div
																 * class="thumb"><img
																 * style="cursor:pointer;height:150px"
																 * src="' +
																 * catalogue.URL +
																 * '/apps/tabsearch/images/hesbania.png"
																 * title="HESBANIA"
																 * alt="HESBANIA"></div><br/><div>HESBANIA</div>'},
																 * listeners: {
																 * render:
																 * function(p) {
																 * p.getEl().on('click',
																 * function(){
																 * searchWithSitekeyword("hesbania");
																 * }); },
																 * single: true } }, {
																 * border:
																 * false,
																 * columnWidth:
																 * 0.15 } ]
																 */
																})
													},
													{// search results panel
														id : 'results',
														title : OpenLayers
																.i18n('List'),
														// layout: 'fit',
														// autoScroll:true,
														layout : 'border',
														items : [
																{
																	region : 'north',
																	border : false,
																	height : 30,
																	autoScroll : true,
																	items : [ breadcrumb ]
																},
																{// sidebar
																	// searchform
																	region : 'west',
																	id : 'west',
																	border : false,
																	frame : false,
																	width : 300,
																	// autoScroll:
																	// true,
																	layout : {
																		type : 'accordion',
																		titleCollapse : true,
																		animate : true,
																		activeOnTop : false
																	},
																	items : [/* resultsMap, */facetsPanel ]
																},
																{ // search
																	// results
																	/*
																	 * region:'center',
																	 * id:'center',
																	 * split:true,
																	 * margins:margins,
																	 * border:
																	 * false,
																	 * items:[resultsPanel]
																	 */
																	layout : 'fit',
																	region : 'center',
																	border : true,
																	padding : 0,
																	// autoScroll:true,
																	items : resultsPanel
																} ],
														/*
														 * Hide tab panel until
														 * a search is done Seem
														 * "hidden:true" as in
														 * other places doesn't
														 * work for Tabs, and
														 * need to use a
														 * listener!
														 * 
														 * See
														 * http://www.sencha.com/forum/showthread.php?65441-Starting-A-Tab-Panel-with-a-Hidden-Tab
														 */
														listeners : {
															render : function(c) {
																// c.ownerCt.hideTabStripItem(c);
															},
															activate : function() {
																if (!searchFirstTime) {
																	Ext
																			.getCmp(
																					'searchBt')
																			.fireEvent(
																					'click');
																	searchFirstTime = true;
																}
															}
														}
													},
													{// map
														id : 'map',
														title : OpenLayers
																.i18n('Map'),
														layout : 'fit',
														margins : margins,
														items : [ iMap
																.getViewport() ],
														listeners : {
															/*
															 * afterLayout:
															 * function(c){ if
															 * (mapTabAccessCount >
															 * 2) return;
															 * 
															 * mapTabAccessCount++; //
															 * First time
															 * afterLayout is
															 * executed on page
															 * load, setting
															 * extent is not ok
															 * then // Set
															 * extent when first
															 * click on Map tab
															 * if
															 * (mapTabAccessCount ==
															 * 2) { if (iMap)
															 * iMap.getMap().zoomToMaxExtent(); } }
															 */
															/*
															 * activate :
															 * function (p) {
															 * p.add(iMap.getViewport());
															 * p.doLayout(); var
															 * metadataResultsView =
															 * app.getMetadataResultsView();
															 * for (i = 0; i <
															 * metadataResultsView.maps.length;
															 * i++) {
															 * metadataResultsView.addCurrentFeatures(metadataResultsView.getMdResultsLayer(metadataResultsView.maps[i].map)); }
															 * 
															 * if
															 * (metadataResultsView.features.length >
															 * 0) { for (i = 0;
															 * i <
															 * metadataResultsView.maps.length;
															 * i++) { var m =
															 * metadataResultsView.maps[i];
															 * if
															 * (m.zoomToExtentOnSearch) {
															 * var resultsLayer =
															 * metadataResultsView.getMdResultsLayer(m.map);
															 * if
															 * (resultsLayer!=null) {
															 * m.map.zoomToExtent(resultsLayer.getDataExtent()); } } } } },
															 */
															deactivate : function(
																	p) {
																var activeWindow = Ext.WindowMgr
																		.getActive();
																if (activeWindow
																		&& activeWindow
																				.getId() == "selectedFeaturePopupWindow") {
																	activeWindow
																			.close();
																}
															}
														}
													},
													{
														title : OpenLayers
																.i18n('documents'),
														layout : 'fit',
														closable : false,
														defaults : {
															bodyStyle : 'border-width:0px'
														},
														items : {
															html : '<div class="facets"><ul><li style="font-size: medodium;">BELAIR Geoportal documentation</li><ul><li><a style="text-decoration: underline; font-size: bigger;" href="'
																	+ catalogue.URL
																	+ '/documents/BELAIR_Geoportal-Manual_for_data_providers-V1.0_20150226.pdf" target="_blank">Manual for BELAIR data providers</a></li><li><a style="text-decoration: underline; font-size: bigger;" href="'
																	+ catalogue.URL
																	+ '/documents/TermsOfUse.pdf" target="_blank">Terms of use</a></li></ul></ul></div>'
														}
													} ]

										// Doesn't work to set extent
										/*
										 * , listeners: { 'tabchange':
										 * function(tabPanel, tab){
										 * 
										 * if (tab.id === 'map') { // Zoom to
										 * full extent (need to be done on tab
										 * select when map is displayed,
										 * otherwise seem extent is not taken
										 * ok) } } }
										 */
										}),
								{
									id : 'footer',
									region : 'south',
									border : true,
									html : "<div><span class='madeBy' style='text-align:right;padding:0px 3px'>"
											+ GeoNetwork.Settings.nodeFooterInfo
											+ "</span></div>",
									layout : 'fit'
								} ],
						listeners : {
							'resize' : function() {
								var editorWindow = Ext.getCmp("editorWindow");
								if (editorWindow != null
										&& editorWindow.isVisible()) {
									editorWindow.restore();
									editorWindow.maximize();
								}
							}
						}
					});

			var loadHomeScreenMap = function() {

				var sitesmap = new google.maps.Map(document
						.getElementById('sitesmap'), {
					zoom : 8,
					center : new google.maps.LatLng(50.7, 4.7),
					mapTypeId : google.maps.MapTypeId.TERRAIN,
					disableDefaultUI : true,
					panControl : true,
					zoomControl : true,
				/*
				 * zoomControlOptions: { style:
				 * google.maps.ZoomControlStyle.LARGE }
				 */
				});

				var siteKeywords = [
						{
							value : 'LITORA',
							bounds : new google.maps.LatLngBounds(
									new google.maps.LatLng(51.293469, 3.123964),
									new google.maps.LatLng(51.293469, 3.123964))
						},
						{
							value : 'SONIA',
							bounds : new google.maps.LatLngBounds(
									new google.maps.LatLng(50.847773, 4.437173),
									new google.maps.LatLng(50.847773, 4.437173))

						},
						{
							value : 'SILVA',
							bounds : new google.maps.LatLngBounds(
									new google.maps.LatLng(50.288, 5.916),
									new google.maps.LatLng(50.288, 5.916))

						},
						{
							value : 'HESBANIA',
							bounds : new google.maps.LatLngBounds(
									new google.maps.LatLng(50.595644, 5.044855),
									new google.maps.LatLng(50.595644, 5.044855))
						} ];

				var sitesInfowindow = new google.maps.InfoWindow();
				var marker;

				for (var site = 0; site < siteKeywords.length; site++) {
					// marker = new google.maps.Marker({
					marker = new MarkerWithLabel(
							{
								position : siteKeywords[site].bounds
										.getCenter(),
								map : sitesmap,
								// icon:
								// 'http://icons.iconarchive.com/icons/aha-soft/transport-for-vista/48/airplane-icon.png',
								icon : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
								animation : google.maps.Animation.DROP,
								labelContent : siteKeywords[site].value,
								labelAnchor : new google.maps.Point(50, 50),
								labelClass : 'marker-label'
							});
					/*
					 * google.maps.event.addListener(marker, 'mouseover',
					 * (function(marker, site) { return function() {
					 * sitesInfowindow.setContent('<p style="min-width: 100%; line-height:1.15; overflow:hidden; white-space:nowrap;">' +
					 * siteKeywords[site].value + '</p>');
					 * sitesInfowindow.open(sitesmap, marker); } })(marker,
					 * site));
					 */
					google.maps.event.addListener(marker, 'click', (function(
							marker, site) {
						return function() {
							searchWithSitekeyword(siteKeywords[site].value
									.toLowerCase());
						}
					})(marker, site));
				}

				var customParams = [ "FORMAT=image/png", "LAYERS=vito:belgium" ];

				// Add query string params to custom params
				var pairs = location.search.substring(1).split('&');
				for (var i = 0; i < pairs.length; i++) {
					customParams.push(pairs[i]);
				}

				loadWMS(sitesmap,
						"http://belair.geoportal.vgt.vito.be/geoserver/wms?",
						customParams);
			}

			$(document).ready(function() {
				loadHomeScreenMap();
			});

			// Hide advanced search options
			// Ext.get("advSearchTabs").hide();

			// Ext.getCmp('mapprojectionselector').syncSize();
			// Ext.getCmp('mapprojectionselector').setWidth(130);

			/*
			 * Trigger visualization mode if mode parameter is 1 TODO : Add
			 * visualization only mode with legend panel on
			 * 
			 * if (urlParameters.mode) { app.switchMode(urlParameters.mode,
			 * false); }
			 */

			/* Init form field URL according to URL parameters */
			GeoNetwork.util.SearchTools.populateFormFromParams(searchForm,
					urlParameters);

			/* Trigger search if search is in URL parameters */
			if (urlParameters.s_search !== undefined) {
				Ext.getCmp('searchBt').fireEvent('click');
			}
			if (urlParameters.edit !== undefined && urlParameters.edit !== '') {
				catalogue.metadataEdit(urlParameters.edit);
			}
			if (urlParameters.create !== undefined) {
				if (resultPanel.getTopToolbar().createMetadataAction) {
					resultPanel.getTopToolbar().createMetadataAction
							.fireEvent('click');
				}
			}
			if (urlParameters.uuid !== undefined) {
				catalogue.metadataShow(urlParameters.uuid, true);
			} else if (urlParameters.id !== undefined) {
				if (urlParameters.external !== undefined
						|| window.location.href.indexOf("index_login.html") > -1) {
					app.metadataShowByIdInTab(urlParameters.id, true);
				} else {
					catalogue.metadataShowById(urlParameters.id, true);
				}
			}

			// FIXME : should be in Search field configuration
			Ext.get('E_any').setWidth(285);
			Ext.get('E_any').setHeight(28);

			// metadataResultsView.addMap( Ext.getCmp('resultsMap').map, true);

			if (GeoNetwork.searchDefault.activeMapControlExtent) {
				Ext.getCmp('geometryMap').setExtent();
			}
			if (urlParameters.bounds) {
				Ext.getCmp('geometryMap').map
						.zoomToExtent(urlParameters.bounds);
			}

			// resultPanel.setHeight(Ext.getCmp('center').getHeight());

			var events = [ 'afterDelete', 'afterRating', 'afterLogout',
					'afterLogin', 'afterStatusChange', 'afterUnlock',
					'afterGrabEditSession' ];
			Ext.each(events, function(e) {
				catalogue.on(e, function() {
					if (searching === true) {
						Ext.getCmp('searchBt').fireEvent('click');
					}
				});
			});
		},

		metadataShowByIdInTab : function(id) {
			// console.log(uuid);
			var url = catalogue.services.mdView + '?id=' + id
					+ '&fromWorkspace=true', record;

			var store = GeoNetwork.data.MetadataResultsFastStore();
			catalogue.kvpSearch("fast=index&_id=" + id, null, null, null, true,
					store, null, false);
			record = store.getAt(store.find('id', id));
			if (record) {
				var uuid = record.get('uuid');
				var any = Ext.getDom('E_any');
				if (any) {
					any.value = uuid;
				}
				var tabPanel = Ext.getCmp("GNtabs");
				var tabs = tabPanel.find('id', uuid);
				// Retrieve information in synchrone mode todo: this doesn't
				// work here
				var RowTitle = uuid;
				try {
					RowTitle = record.data.title;
				} catch (e) {
				}
				var RowLabel = RowTitle;
				if (RowLabel.length > 18)
					RowLabel = RowLabel.substr(0, 17) + "...";

				var extra = "";
				if (record.data.locked === "y" && record.data.edit === 'true') {
					// Show always workspace version
					extra = "&fromWorkspace=true";
				}

				var aResTab = new GeoNetwork.view.ViewPanel(
						{
							serviceUrl : catalogue.services.mdView + '?uuid='
									+ uuid + extra,
							lang : catalogue.lang,
							resultsView : app.getMetadataResultsView(),
							layout : 'fit',
							currTab : GeoNetwork.defaultViewMode || 'simple',
							printDefaultForTabs : GeoNetwork.printDefaultForTabs || false,
							catalogue : catalogue,
							// maximized: true,
							metadataUuid : uuid,
							record : record,
							workspaceCopy : record.get('workspace') == "true" ? true
									: false
						});

				// Override zoomToAction (maye better way?). TODO: Check as seem
				// calling old handler code
				aResTab.actionMenu.zoomToAction.setHandler(function() {
					var uuid = this.record.get('uuid');
					this.resultsView.zoomTo(uuid);

					// Custom code to display Map tab
					/* tabPanel.setActiveTab( tabPanel.items.itemAt(2) ); */
				}, aResTab.actionMenu);

				aResTab.actionMenu.viewAction.hide();

				tabPanel.add({
					title : RowLabel,
					layout : 'fit',
					tabTip : RowTitle,
					iconCls : 'tabs',
					id : uuid,
					closable : true,
					items : aResTab
				}).show();
			} else {
				Ext.MessageBox.alert(OpenLayers.i18n('error'), OpenLayers
						.i18n('error-login'), function() {
					// window.location = "../tabsearch";
					// location.replace(window.location.pathname + "?hl=dut");
				});
			}
		},

		getIMap : function() {
			// init map if not yet initialized
			if (!iMap) {
				initMap();
			}

			// TODO : maybe we should switch to visualization mode also ?
			return iMap;
		},
		getHelpWindow : function() {
			return new Ext.Window({
				title : OpenLayers.i18n('Help'),
				layout : 'fit',
				height : 600,
				width : 600,
				closable : true,
				resizable : true,
				draggable : true,
				items : [ createHelpPanel() ]
			});
		},
		getAboutWindow : function() {
			return new Ext.Window({
				title : OpenLayers.i18n('About'),
				layout : 'fit',
				height : 600,
				width : 600,
				closable : true,
				resizable : true,
				draggable : true,
				items : [ creatAboutPanel() ]
			});
		},
		getCatalogue : function() {
			return catalogue;
		},
		getMetadataResultsView : function() {
			return metadataResultsView;
		},
		/**
		 * Do layout
		 * 
		 * @param response
		 * @return
		 */
		loadResults : function(response) {
			// Show "List results" panel
			var tabPanel = Ext.getCmp("GNtabs");
			tabPanel.unhideTabStripItem(tabPanel.items.itemAt(1));

			initPanels();
			facetsPanel.refresh(response);

			// FIXME : result panel need to update layout in case of slider
			// Ext.getCmp('resultsPanel').syncSize();

			Ext.getCmp('previousBt').setDisabled(catalogue.startRecord === 1);
			Ext.getCmp('nextBt').setDisabled(
					catalogue.startRecord
							+ parseInt(Ext.getCmp('E_hitsperpage').getValue(),
									10) > catalogue.metadataStore.totalLength);
			if (Ext.getCmp('E_sortBy').getValue()) {
				Ext.getCmp('sortByToolBar').setValue(
						Ext.getCmp('E_sortBy').getValue() + "#"
								+ Ext.getCmp('sortOrder').getValue());

			} else {
				Ext.getCmp('sortByToolBar').setValue(
						Ext.getCmp('E_sortBy').getValue());

			}

			// Fix for width sortBy combo in toolbar
			// See this:
			// http://www.sencha.com/forum/showthread.php?122454-TabPanel-deferred-render-false-nested-toolbar-layout-problem
			Ext.getCmp('sortByToolBar').syncSize();
			Ext.getCmp('sortByToolBar').setWidth(130);

			resultsPanel.syncSize();

			// resultsPanel.setHeight(Ext.getCmp('center').getHeight());

			// Ext.getCmp('west').syncSize();
			// Ext.getCmp('center').syncSize();
			// Ext.ux.Lightbox.register('a[rel^=lightbox]');
		},
		/**
		 * Switch from one mode to another
		 * 
		 * @param mode
		 * @param force
		 * @return
		 */
		switchMode : function() {
			setTab('map');
		}
	/*
	 * switchMode: function(mode, force){ setTab('map'); mode = '1';
	 * //console.log(visualizationModeInitialized);
	 * 
	 * if (!visualizationModeInitialized) { initMap(); } //console.log( iMap);
	 * if (iMap) { // var e = Ext.getCmp('map'); // e.add(iMap.getViewport()); //
	 * e.doLayout(); // Ext.getCmp('vp').syncSize(); } }
	 */
	};
};

Ext.onReady(function() {
	var lang = /hl=([a-z]{3})/.exec(location.href);
	GeoNetwork.Util.setLang(lang && lang[1], '..');

	Ext.QuickTips.init();
	setTimeout(function() {
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove : true
		});
	}, 250);

	app = new GeoNetwork.app();
	app.init();
	catalogue = app.getCatalogue();

	// overwrite default detail-click action
	catalogue.metadataShow = function(uuid, isTemplate) {
		// console.log(uuid);
		tabPanel = Ext.getCmp("GNtabs");
		var tabs = tabPanel.find('id', uuid);
		if (tabPanel.activeTab && tabPanel.activeTab.title == "Home") {
			location.replace(location.pathname + '?uuid=' + escape(uuid)
					+ '&hl=dut');
			/*
			 * var store = GeoNetwork.data.MetadataResultsFastStore();
			 * this.kvpSearch("fast=index&_uuid=" + escape(uuid), null, null,
			 * null, true, store, null, false, true); var record =
			 * store.getAt(store.find('uuid', uuid)); if (!record) {
			 * this.kvpSearch("fast=index&_uuid=" + escape(uuid.toLowerCase()),
			 * null, null, null, true, store, null, false, false); record =
			 * store.getAt(store.find('uuid', uuid.toLowerCase())); } if
			 * (record) { alert("Load replacing url");
			 * location.replace(location.pathname + '?uuid=' +
			 * escape(record.get('uuid')) + '&hl=dut'); }
			 */
		} else if (tabs[0]) {
			tabPanel.setActiveTab(tabs[0]);
			/*
			 * var newTitle = uuid; try{newTitle=record.data.title;} catch (e) {}
			 * tabPanel.setTitle(newTitle);
			 */
			Ext.getCmp(uuid + '_viewpanel').doAutoLoad();
		} else {
			// Retrieve information in synchrone mode todo: this doesn't work
			// here
			var store = GeoNetwork.data.MetadataResultsFastStore();
			var record = store.getAt(store.find('uuid', uuid));
			if (record == null) {
				catalogue.kvpSearch("fast=index&_uuid=" + uuid + "&template="
						+ (Ext.isEmpty(isTemplate) ? "n" : isTemplate), null,
						null, null, true, store, null, false);
				record = store.getAt(store.find('uuid', uuid));
			}

			var RowTitle = uuid;

			try {
				RowTitle = record.data.title;
			} catch (e) {
			}
			var RowLabel = RowTitle;
			if (RowLabel.length > 18)
				RowLabel = RowLabel.substr(0, 17) + "...";

			var extra = "";
			if (record.data.locked === "y" && record.data.edit === 'true') {
				// Show always workspace version
				extra = "&fromWorkspace=true";
			}

			var aResTab = new GeoNetwork.view.ViewPanel({
				serviceUrl : catalogue.services.mdView + '?uuid=' + uuid
						+ extra,
				lang : catalogue.lang,
				resultsView : app.getMetadataResultsView(),
				layout : 'fit',
				currTab : GeoNetwork.defaultViewMode || 'simple',
				printDefaultForTabs : GeoNetwork.printDefaultForTabs || false,
				catalogue : catalogue,
				// maximized: true,
				metadataUuid : uuid,
				record : record,
				workspaceCopy : record.get('workspace') == "true" ? true
						: false
			});

			// Override zoomToAction (maye better way?). TODO: Check as seem
			// calling old handler code
			aResTab.actionMenu.zoomToAction.setHandler(function() {
				var uuid = this.record.get('uuid');
				this.resultsView.zoomTo(uuid);

				// Custom code to display Map tab
				/* tabPanel.setActiveTab( tabPanel.items.itemAt(2) ); */
			}, aResTab.actionMenu);

			aResTab.actionMenu.viewAction.hide();

			tabPanel.add({
				title : RowLabel,
				layout : 'fit',
				tabTip : RowTitle,
				iconCls : 'tabs',
				id : uuid,
				closable : true,
				items : aResTab
			}).show();

		}

	}

	/*
	 * catalogue.on('afterLogin', function(){ tabPanel = Ext.getCmp("GNtabs");
	 * tabPanel.add({ title: 'Admin', tabTip:'Administration', iconCls: 'tabs',
	 * id: 'adminPnl', closable:false, autoLoad:{ url:catalogue.services.admin,
	 * scripts:true } }).show(); });
	 */

	/* Focus on full text search field */
	// Ext.getDom('E_any').focus(true);
});

function setTab(id) {
	tabPanel = Ext.getCmp("GNtabs");
	var tabs = tabPanel.find('id', id);
	if (tabs[0])
		tabPanel.setActiveTab(tabs[0]);
	// else console.log(id);
}

function addWMSLayer(arr) {
	app.switchMode(/* '1', true */);
	app.getIMap().addWMSLayer(arr);
}
