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
Ext.namespace('GeoNetwork.editor');


/** api: (define)
 *  module = GeoNetwork.editor
 *  class = NewMetadataPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor
 *  .. class:: NewMetadataPanel(config)
 *
 *     Create a GeoNetwork form for metadata creation
 *
 *
 *     Default metadata store to use could be overriden when setting
 *     GeoNetwork.Settings.mdStore variables. Default is :class:`GeoNetwork.data.MetadataResultsStore`.
 *
 */
GeoNetwork.editor.NewMetadataPanel = Ext.extend(Ext.Panel, {
    defaultConfig: {
    	layout:'fit',
        border: false,
        frame: false,
        isTemplate: 'n'
    },
    editor: undefined,
    getGroupUrl: undefined,
    groupStore: undefined,
    catalogue: undefined,
    tplStore: undefined,
    selectedGroup: undefined,
    selectedTpl: undefined,
    isChild: undefined,
    filter: undefined,
    combo: undefined,
    createBt: undefined,
    singleSelect: true,
    validate: function(){
        if (!Ext.isEmpty(this.selectedGroup) && this.selectedTpl !== undefined) {
            this.createBt.setDisabled(false);
        } else {
            this.createBt.setDisabled(true);
        }
    },

    /** private: method[initComponent]
     *  Initializes the help panel.
     */
    initComponent: function(){
        Ext.applyIf(this, this.defaultConfig);
        var checkboxSM, colModel;


        this.createBt = new Ext.Button({
            text: OpenLayers.i18n('create'),
            iconCls: 'addIcon',
            disabled: true,
            handler: function(){
                // FIXME could be improved
                this.catalogue.metadataEdit(this.selectedTpl, true, this.selectedGroup, this.isChild, this.isTemplate);
                this.ownerCt.hide();
            },
            scope: this
        });

        this.buttons = [this.createBt, {
            text: OpenLayers.i18n('cancel'),
            iconCls: 'cancel',
            handler: function(){
                this.ownerCt.hide();
            },
            scope: this
        }];

        GeoNetwork.editor.NewMetadataPanel.superclass.initComponent.call(this);

        this.groupStore = new Ext.data.XmlStore({
            autoDestroy: true,
            proxy: new Ext.data.HttpProxy({
                method: 'GET',
                url: this.getGroupUrl,
                disableCaching: false
            }),
            record: 'group',
            idPath: 'id',
            fields: [{
                name: 'id',
                mapping: '@id'
            }, {
                name: 'name'
            }, {
                name: 'label', mapping: 'label>dut'
            }],
            autoLoad: true
        });
        
        var tpl = '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.label}">{values.label}</div></tpl>';
        this.combo = new Ext.form.ComboBox({
        	name: 'E_group',
            mode: 'local',
            emptyText: OpenLayers.i18n('chooseGroup'),
            editable: true,
            selectOnFocus:true,
            forceSelection:true,
            autoShow:true,
            triggerAction: 'all',
            fieldLabel: OpenLayers.i18n('group'),
            labelWidth: 50,
            store: this.groupStore,
            allowBlank: false,
            valueField: 'id',
            displayField: 'label',
            width: 400,
            tpl: tpl, 
//            tpl: '<tpl for="."><div class="x-combo-list-item">{[values.label.' + GeoNetwork.Util.getCatalogueLang(OpenLayers.Lang.getCode()) + ']}</div></tpl>',
            listeners: {
                change: function(combo, newValue, oldValue){
                    this.selectedGroup = newValue;
//                    this.combo.setValue(record.data.label[GeoNetwork.Util.getCatalogueLang(OpenLayers.Lang.getCode())]);
                    this.validate();
                },
                scope: this
            }
        });
        
        var statusFilter = function(record){
        	return record.get('status') == 2;
        };

        // Only add template if not already defined (ie. duplicate action)
        if (!this.selectedTpl) {
            this.tplStore = GeoNetwork.Settings.mdStore ? GeoNetwork.Settings.mdStore() : GeoNetwork.data.MetadataResultsStore();
            this.tplStore.setDefaultSort('displayOrder');
            /*this.tplStore.on('load', function(store, records, options) { 
            	store.filter('status', '2', true, false);
            });*/
            this.tplStore.on('load',function(cObj,recs) {
                Ext.each(recs,function(rec){
                    if(rec.data.status == '1'){
                    	rec.data.title += ' (draft)'
                    } else if(rec.data.status == '4'){
                    	rec.data.title += ' (submitted)'
                    }
                });  
          	});

            // Create grid with template list
            checkboxSM = new Ext.grid.CheckboxSelectionModel({
                singleSelect: this.singleSelect,
                header: ''
            });

            colModel = new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true
                },
                columns: [
                    checkboxSM,
                    {header: 'Schema', dataIndex: 'schema'},
                    {id: 'title', header: 'Title', dataIndex: 'title'},
                    {header: 'Order', hidden: true, dataIndex: 'displayOrder'},
                    {header: 'Status', hidden: true, dataIndex: 'status'}
                ]});

            var grid = new Ext.grid.GridPanel({
                layout: 'fit',
                title: OpenLayers.i18n('chooseTemplate'),
                border: false,
                autoScroll: true,
                height: 330,
                store: this.tplStore,
                colModel: colModel,
                sm: checkboxSM,
                autoExpandColumn: 'title',
                viewConfig: {
                    getRowClass: function(rec, rowIdx, params, store) {
                      return rec.get('status') != 2 ? 'gridpanel-orange-back' : 'gridpanel-green-back';
                    }
                },
                listeners: {
                    rowclick: function(grid, rowIndex, e) {
                        var data = grid.getStore().getAt(rowIndex).data;
                        if(data.status!=2){
                        	grid.getSelectionModel().deselectRow(rowIndex);
                        	return;
                        }
                        if (grid.getSelectionModel().getCount() !== 0) {
                            this.selectedTpl = data.id;
                        } else {
                            this.selectedTpl = undefined;
                        }
                        this.validate();
                    },
                    scope : this
                },
                fbar: [OpenLayers.i18n('group'),this.combo]            
            });
            this.add(grid);

            this.catalogue.search({E_template: 'y'}, null, null, 1, true, this.tplStore, null);
        } else {
            this.add({
            	border: false,
                layout:'form',
                items:[
                   	this.combo
                ]
            });
        }
        
        this.add({
            xtype: 'textfield',
            name: 'isTemplate',
            hidden: true,
            value: this.isTemplate
        });
        // Remove special groups and select first group in the list
        this.groupStore.load({
            callback: function(){
                this.groupStore.each(function(record) {
                    if ((record.get('id') == '-1') || (record.get('id') == '0') || (record.get('id') == '1')) {
                        this.remove(record);
                    }
                },  this.groupStore);


                if (this.groupStore.getCount() > 0) {
                    var recordSelected = this.groupStore.getAt(0);
                    if (recordSelected) {
                        this.selectedGroup = recordSelected.get('id');
                        this.combo.setValue(recordSelected.get('id'));
//                        this.combo.setValue(recordSelected.data.label[GeoNetwork.Util.getCatalogueLang(OpenLayers.Lang.getCode())]);
                        this.validate();
                    }
                }
            },
            scope: this
        });
    }
});

/** api: xtype = gn_editor_newmetadatapanel */
Ext.reg('gn_editor_newmetadatapanel', GeoNetwork.editor.NewMetadataPanel);