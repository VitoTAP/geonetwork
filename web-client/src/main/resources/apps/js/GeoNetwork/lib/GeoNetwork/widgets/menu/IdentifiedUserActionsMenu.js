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
 *  class = MetadataActionsMenu
 *  base_link = `Ext.menu.Menu <http://extjs.com/deploy/dev/docs/?class=Ext.menu.Menu>`_
 *
 */
/** api: constructor 
 *  .. class:: IdentifiedUserActionsMenu(config)
 *
 *     Create a menu for an identified user
 *
 *
 */
GeoNetwork.IdentifiedUserActionsMenu = Ext.extend(Ext.menu.Menu, {
    /** api: config[catalogue] 
     * ``GeoNetwork.Catalogue`` Catalogue to use
     */
    catalogue: undefined,
    
    newMetadataWindow: undefined,
    newMetadataMenu: undefined,
    importMetadataMenu: undefined,
    administrationMenu: undefined,
    logoutMenu: undefined,

    /** private: method[initComponent] 
     *  Initializes the toolbar results view.
     */
    initComponent: function(){
        GeoNetwork.IdentifiedUserActionsMenu.superclass.initComponent.call(this);
    	this.newMetadataMenu = new Ext.menu.Item({
            text: OpenLayers.i18n('newMetadata'),
            iconCls: 'addIcon',
            handler: function(){
                // FIXME : could be improved. Here we clean the window
                // A simple template reload could be enough probably
				if (this.isUserLoggedIn()) {
	                if (this.newMetadataWindow) {
	                    this.newMetadataWindow.close();
	                    this.newMetadataWindow = undefined;
	                }
	                
	                // Create a window to choose the template and the group
	                if (!this.newMetadataWindow) {
	                    var newMetadataPanel = new GeoNetwork.editor.NewMetadataPanel({
	                                getGroupUrl: this.catalogue.services.getGroups,
	                                catalogue: this.catalogue
	                            });
	                    
	                    this.newMetadataWindow = new Ext.Window({
	                        title: OpenLayers.i18n('newMetadata'),
	                        width: 600,
	                        height: 420,
	                        layout: 'fit',
	                        modal: true,
	                        items: newMetadataPanel,
	                        closeAction: 'hide',
	                        constrain: true,
	                        iconCls: 'addIcon'
	                    });
	                }
	                this.newMetadataWindow.show();
                }
            },
            scope: this
        });
        this.add(this.newMetadataMenu);
        this.importMetadataMenu = new Ext.menu.Item({
            text: OpenLayers.i18n('importMetadata'),
            handler: function(){
				if (this.isUserLoggedIn()) {
	                this.catalogue.metadataImport();
                }
            },
            scope: this
        });
        this.add(this.importMetadataMenu);
    	this.administrationMenu = new Ext.menu.Item({
            text: OpenLayers.i18n('administration'),
            handler: function(){
				if (this.isUserLoggedIn()) {
	                this.catalogue.admin();
                }
            },
            scope: this
        });        
        this.add(this.administrationMenu);
        this.logoutMenu = new Ext.menu.Item({
            text: OpenLayers.i18n('logout'),
            iconCls: 'md-mn mn-logout',
            handler: function(){
				if (this.isUserLoggedIn()) {
	                this.catalogue.logout();
                }
            },
            scope: this
        });        
        this.add(this.logoutMenu);
        this.updateMenuItems();
    },
    updateMenuItems: function() {
    	var visible = this.catalogue.isIdentified() ;
	    this.newMetadataMenu.setVisible(visible && this.catalogue.identifiedUser.role!='RegisteredUser');
	    this.logoutMenu.setVisible(visible);
	    this.importMetadataMenu.setVisible(visible && this.catalogue.identifiedUser.role=='Administrator');
	    this.administrationMenu.setVisible(visible && this.catalogue.identifiedUser.role=='Administrator')
    },
    isUserLoggedIn: function() {
		this.catalogue.isLoggedIn(false);
		if (this.catalogue.isIdentified()) {
			return true;
		} else {
			Ext.MessageBox.alert(OpenLayers.i18n('error'),OpenLayers.i18n('userSessionEnded'))
			return false;
		}
    }

});

/** api: xtype = gn_identifieduseractionsmenu */
Ext.reg('gn_identifieduseractionsmenu', GeoNetwork.IdentifiedUserActionsMenu);
