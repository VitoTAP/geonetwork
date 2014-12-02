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

/**
 * @require Catalogue.js
 */
/** api: (define)
 *  module = GeoNetwork
 *  class = LoginForm
 *  base_link = `Ext.FormPanel <http://extjs.com/deploy/dev/docs/?class=Ext.FormPanel>`_
 */
/** api: constructor 
 *  .. class:: LoginForm(config)
 *
 *     Create a GeoNetwork login form.
 */
/** api: example
 *
 *
 *  .. code-block:: javascript
 *  
 *     var loginForm2 = new GeoNetwork.LoginForm({
 *        renderTo: 'login-form',
 *        id: 'loginForm',
 *        catalogue: catalogue,
 *        layout: 'hbox'
 *      });
 *      
 *      ...
 */
GeoNetwork.LoginForm = Ext.extend(Ext.FormPanel, {
    url: '',
    /** api: config[catalogue] 
     * ``GeoNetwork.Catalogue`` Catalogue to use
     */
    catalogue: undefined,
    defaultConfig: {
        border: false,
    	layout: 'form',
        id: 'loginForm',
    	/** api: config[displayLabels] 
         * In hbox layout, labels are not displayed, set to true to display field labels.
         */
    	hideLoginLabels: true,
    	width: 400
    },
    nodeType: undefined,
    defaultType: 'textfield',
    /** private: property[userInfo]
     * Use to display user information (name, password, profil).
     */
    userInfo: undefined,
    username: undefined,
    password: undefined,
    loginFields: [],
    
    /** private: property[toggledFields]
     * List of fields to hide on login.
     */
    toggledFields: [],
    /** private: property[toggledFields]
     * List of fields to display on login.
     */
    toggledFieldsOff: [],
    /** private: method[initComponent] 
     *  Initializes the login form results view.
     */

    keys: [{
        key: [Ext.EventObject.ENTER], handler: function() {
            Ext.getCmp('btnLoginForm').fireEvent('click');
        }
    }],

    initComponent: function(){
    	Ext.applyIf(this, this.defaultConfig);
    	this.nodeType = GeoNetwork.Settings.nodeType.toLowerCase();
    	var form = this;
    	var loginBt = new Ext.Button({
	            width: 80,
	            columnWidth: 0.19,
	            text: OpenLayers.i18n('login'),
	            iconCls: 'md-mn mn-login',
                id: 'btnLoginForm',
	            listeners: {
	                click: function(){
	                    this.catalogue.login(this.username.getValue(), this.password.getValue());
	                },
	                scope: form
	            }
	        }),
	        registerBt = new Ext.LinkButton({
//	            width: 80,
	    		columnWidth: 0.25,
	            text: OpenLayers.i18n('register'),
                id: 'btnRegisterForm',
	            listeners: {
	                click: function(){
	                	if(this.nodeType == "sigma"){
	                		this.catalogue.modalAction(OpenLayers.i18n('register'),this.catalogue.services.register);
	                	}else if(this.nodeType == "belair"){
	                		window.open("http://www.vito-eodata.be/PDF/portal/Application.html#Home");
	                		//this.showPdfRegisterWindow();
	                	}
	                },
	                scope: form
	            }
	        }),
	        forgottenBt = new Ext.LinkButton({
//	            width: 125,
	    		columnWidth: 0.50,
	            text: OpenLayers.i18n('forgotten'),
                id: 'btnForgottenForm',
	            listeners: {
	                click: function(){
	                	if(this.nodeType == "sigma"){
	                		this.catalogue.modalAction(OpenLayers.i18n('forgotten'),this.catalogue.services.forgotten);
	                	}else if(this.nodeType == "belair"){
	                		window.open("http://www.vito-eodata.be/PDF/portal/Application.html#Home");
	                		//this.showPdfPasswordRecoveryWindow();
	                	}
	                },
	                scope: form
	            }
	        }),
	        contactUsBt = new Ext.LinkButton({
//	            width: 80,
	        	columnWidth: 0.25,
	            text: OpenLayers.i18n('contactUs'),
                id: 'btnContactUs',
	            listeners: {
	                click: function(){
	                	window.location = 'mailto:belairgeoporal@vgt.vito.be';
	                },
	                scope: form
	            }
	        })
	        /*,
	        logoutBt = new Ext.Button({
	            width: 60,
//	    		columnWidth: 0.75,
	    		style: "text-align:right",
	            text: OpenLayers.i18n('logout'),
	            iconCls: 'md-mn mn-logout',
	            listeners: {
	                click: function(){
	                    catalogue.logout();
	                },
	                scope: this
	            }
	        })*/;
    	this.username = new Ext.form.TextField({
    		columnWidth: this.hideLoginLabels ? 0.4 : 0.2,
    		id: 'username',
    		name: 'username',
            width: 70,
            hidden: GeoNetwork.Settings.useSTS,
            hideLabel: false,
            allowBlank: false,
            fieldLabel: OpenLayers.i18n('username'),
            emptyText: OpenLayers.i18n('username'),
            style: {
            	marginRight: '3px'
            }
        });
        this.password = new Ext.form.TextField({
    		columnWidth: this.hideLoginLabels ? 0.4 : 0.2,
            name: 'password',
            width: 70,
            hidden: GeoNetwork.Settings.useSTS,
            hideLabel: false,
            allowBlank: false,
            fieldLabel: OpenLayers.i18n('password'),
            emptyText: OpenLayers.i18n('password'),
            inputType: 'password',
            style: {
            	marginRight: '3px'
            }
        });
		var labelStyle = "color:#fff;font-size:1.2em;font-weight:bold;top:2px;";
    	this.userInfo = new Ext.form.Label({
    		columnWidth: 0.75,
            width: 170,
            text: '',
            cls: 'loginInfo',
            style: labelStyle
        });
    	
		var loginItems = null;
		if (this.hideLoginLabels) {
    		this.loginFields.push( 
            		this.username,
                    this.password,
                    loginBt);
            if (this.nodeType == "sigma" || this.nodeType == "belair") {
            	this.loginFields.push(registerBt,forgottenBt,contactUsBt);
            }
    		if (!GeoNetwork.Settings.useSTS) {
	    		this.toggledFields.push( 
	            		this.username,
	                    this.password);
    		}
    		this.toggledFields.push(loginBt);
            if (this.nodeType == "sigma" || this.nodeType == "belair") {
        		this.toggledFields.push(registerBt);
        		this.toggledFields.push(forgottenBt);
        		this.toggledFields.push(contactUsBt);
            }
    		loginItems = [this.username,this.password];
    	} else {
    		// hbox layout does not display TextField labels, create a label then
        	var usernameLb = new Ext.form.Label({columnWidth:0.2,style:labelStyle,hidden:GeoNetwork.Settings.useSTS,html: OpenLayers.i18n('username')}),
    			passwordLb = new Ext.form.Label({columnWidth:0.2,style:labelStyle,hidden:GeoNetwork.Settings.useSTS,html: OpenLayers.i18n('password')});
    		this.loginFields.push(usernameLb, 
            		this.username,
                    passwordLb,
                    this.password,
                    loginBt);
            if (this.nodeType == "sigma" || this.nodeType == "belair") {
            	this.loginFields.push(registerBt,forgottenBt,contactUsBt);
            }
    		if (!GeoNetwork.Settings.useSTS) {
	        	this.toggledFields.push(usernameLb, 
	            		this.username,
	                    passwordLb,
	                    this.password);
    		}
        	this.toggledFields.push(loginBt);
            if (this.nodeType == "sigma" || this.nodeType == "belair") {
        		this.toggledFields.push(registerBt);
        		this.toggledFields.push(forgottenBt);
        		this.toggledFields.push(contactUsBt);
            }
    		loginItems = [usernameLb,this.username,passwordLb,this.password];
    	}
		var flexCmp = new Ext.form.Label({columnWidth:0.75,style:labelStyle,html: '&nbsp;'});
    	var actionsBt = new Ext.Button({
    		columnWidth: 0.25,
    		style: {
                marginLeft: '20px'
            },
    		text: OpenLayers.i18n('Actions'),
    		menu: new GeoNetwork.IdentifiedUserActionsMenu({
        		catalogue: this.catalogue
    		})});
    	this.toggledFieldsOff.push(this.userInfo, 
                /*logoutBt,  flexCmp,*/ actionsBt);
    	this.items = [loginItems,this.userInfo,loginBt];
        if (this.nodeType == "sigma" || this.nodeType == "belair") {
        	this.items.push(registerBt);
        	this.items.push(forgottenBt);
    	}
        //this.items.push(logoutBt);
        //this.items.push([flexCmp, actionsBt]);
        this.items.push(actionsBt);
        /*if(this.catalogue.identifiedUser || this.nodeType == 'belair') {
        	this.items.push(flexCmp);
        }*/
        this.items.push(contactUsBt);
/*
    	this.items = [this.loginFields, this.toggledFieldsOff];
*/
        GeoNetwork.LoginForm.superclass.initComponent.call(this);
        // check user on startup with a kind of ping service
        this.catalogue.on('afterLogin', this.login, this);
        this.catalogue.on('afterLogout', this.login, this);
        this.catalogue.isLoggedIn(true);
    },
    
    /** private: method[login]
     *  Update layout according to login/out operation
     */
    login: function(cat, user){
        var status = cat.identifiedUser ? true : false;
        
        Ext.each(this.toggledFields, function(item) {
        	item.setVisible(!status);
        });
        Ext.each(this.toggledFieldsOff, function(item) {
        	if (item.text==OpenLayers.i18n('administration')) {
               	item.setVisible(status && cat.identifiedUser.role=='Administrator');
        	} else {
            	item.setVisible(status);
	        	if (item.text==OpenLayers.i18n('Actions')) {
	        		item.menu.updateMenuItems();
	        	}
        	}
        });
        if (cat.identifiedUser && cat.identifiedUser.username) {
            this.userInfo.setText("Hello " + cat.identifiedUser.name + " " + cat.identifiedUser.surname, false);
        } else {
            this.userInfo.setText('');
        }
        this.doLayout(false, true);
    },
    
    showPdfRegisterWindow: function(){
    	// request parameters needed for PDF registration form
    	var request = OpenLayers.Request.GET({
    	    url: this.catalogue.services.pdfGetParameters,
    	    async: false
    	});
    	var requestObj = eval('(' + request.responseText + ')');
    	
    	// parse parameters into usable format
    	var parameters = {};
    	for(var i=0;i<requestObj.length;i++){
    		// if format of this parameter is of type '<extra>', request possible values with request 'extra'
    		if(requestObj[i].format.charAt(0) === '<'){
    			request = OpenLayers.Request.GET({
    	    	    url: this.catalogue.pdfUrl + '?action=' + requestObj[i].format.replace('<','').replace('>',''),
    	    	    async: false
    	    	});
    			var temp = eval('(' + request.responseText + ')');
    			requestObj[i].formatParams = [];
    			for(var j=0;j<temp.length;j++){
    				requestObj[i].formatParams.push([temp[j].id, temp[j].value]);
    			}
    		}
    		
    		parameters[requestObj[i].id.toLowerCase()] = requestObj[i];
    	}
    	
    	var self = this;
    	this.form = new Ext.form.FormPanel({
        	title: '',
            width: 400,
            frame: true,
            
            labelSeparator: ',',
            url: this.catalogue.services.pdfRegister,
            
            /*layout: 'form',
            defaults: {
                anchor: '50%'
            },
            margins: '0 50 0 50',
            
            fieldDefaults: {
                msgTarget: 'side',
                anchor: '30%'
            },
            labelStyle: 'width:200px',*/
            
            items: [{
            	layout: 'column',
            	items: [{
            		columnWidth: .5,
                    layout: 'form',
                    defaultType: 'textfield',
                    defaults: {
            			labelSeparator: '',
            			anchor: '90%'
            		},
                    items: [{
                    	fieldLabel: 'User name' + (parameters.username.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'username',
                        allowBlank: parameters.username.presence !== 'mandatory',
                        tabIndex: 1
                    }, {
                        fieldLabel: 'Password' + (parameters.password.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'password',
                        inputType: 'password',
                        allowBlank: parameters.password.presence !== 'mandatory',
                        tabIndex: 2
                    }, {
                        fieldLabel: 'First name' + (parameters.firstname.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'firstName',
                        allowBlank: parameters.firstname.presence !== 'mandatory',
                        tabIndex: 4
                    }, {
                        fieldLabel: 'E-mail' + (parameters.emailaddress.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'emailAddress',
                        allowBlank: parameters.emailaddress.presence !== 'mandatory',
                        tabIndex: 6
                    }, {
                        fieldLabel: 'Company name' + (parameters.company.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'company',
                        allowBlank: parameters.company.presence !== 'mandatory',
                        tabIndex: 7
                    }, {
                    	xtype: 'combo',
                    	fieldLabel: 'Domain of activity' + (parameters.domainactivity.presence === 'mandatory' ? ' (*)' : ''),
                    	name: 'domainactivityValue',
                    	hiddenName: 'domainactivity',
                    	editable: false,
                        triggerAction: 'all',
                        lazyRender: true,
                        mode: 'local',
                        store: new Ext.data.ArrayStore({
                            id: 0,
                            fields: ['id', 'value'],
                            data: parameters.domainactivity.formatParams
                        }),
                        valueField: 'id',
                        displayField: 'value',
                        allowBlank: parameters.domainactivity.presence !== 'mandatory',
                        tabIndex: 9
                    }, {
                    	xtype: 'combo',
                    	fieldLabel: 'Function' + (parameters['function'].presence === 'mandatory' ? ' (*)' : ''),
                    	name: 'functionValue',
                    	hiddenName: 'function',
                    	editable: false,
                        triggerAction: 'all',
                        lazyRender: true,
                        mode: 'local',
                        store: new Ext.data.ArrayStore({
                            id: 0,
                            fields: ['id', 'value'],
                            data: parameters['function'].formatParams
                        }),
                        valueField: 'id',
                        displayField: 'value',
                        allowBlank: parameters['function'].presence !== 'mandatory',
                        tabIndex: 11
                    }, {
                        fieldLabel: 'Street address' + (parameters.street.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'street',
                        allowBlank: parameters.street.presence !== 'mandatory',
                        tabIndex: 12
                    }, {
                        fieldLabel: 'Zip' + (parameters.zip.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'zip',
                        allowBlank: parameters.zip.presence !== 'mandatory',
                        tabIndex: 13
                    }, {
                    	xtype: 'combo',
                    	fieldLabel: 'Country' + (parameters.countryid.presence === 'mandatory' ? ' (*)' : ''),
                    	name: 'countryValue',
                    	hiddenName: 'countryid',
                    	editable: false,
                        triggerAction: 'all',
                        lazyRender: true,
                        mode: 'local',
                        store: new Ext.data.ArrayStore({
                            id: 0,
                            fields: ['id', 'value'],
                            data: parameters.countryid.formatParams
                        }),
                        valueField: 'id',
                        displayField: 'value',
                        allowBlank: parameters.countryid.presence !== 'mandatory',
                        tabIndex: 15
                    }, {
                        fieldLabel: 'Phone nr.' + (parameters.telephonenbr.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'telephonenbr',
                        allowBlank: parameters.telephonenbr.presence !== 'mandatory',
                        tabIndex: 17
                    }]
            	}, {
            		columnWidth: .5,
            		layout: 'form',
            		defaults: {
            			labelSeparator: '',
            			labelWidth: '200',
            			anchor: '90%'
            		},
            		items: [{},{}, 
            		{
            			xtype: 'textfield',
                        fieldLabel: 'Confirm password' + (parameters.password.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'confirmPassword',
                        inputType: 'password',
                        allowBlank: parameters.password.presence !== 'mandatory',
                        tabIndex: 3
                    }, {
                    	xtype: 'textfield',
                        fieldLabel: 'Last Name' + (parameters.surname.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'lastName',
                        allowBlank: parameters.surname.presence !== 'mandatory',
                        tabIndex: 5
                    }, {},{
                    	
                    }, {
                    	xtype: 'textfield',
                        fieldLabel: 'Department' + (parameters.department.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'department',
                        allowBlank: parameters.department.presence !== 'mandatory',
                        tabIndex: 8
                    }, {
                    	xtype: 'combo',
                    	fieldLabel: 'Type of organisation' + (parameters.organisationaltype.presence === 'mandatory' ? ' (*)' : ''),
                    	name: 'organisationaltypeValue',
                    	hiddenName: 'organisationaltype',
                    	editable: false,
                        triggerAction: 'all',
                        lazyRender: true,
                        mode: 'local',
                        forceSelection: true,
                        store: new Ext.data.ArrayStore({
                            id: 0,
                            fields: ['id', 'value'],
                            data: parameters.organisationaltype.formatParams
                        }),
                        valueField: 'id',
                        displayField: 'value',
                        allowBlank: parameters.organisationaltype.presence !== 'mandatory',
                        tabIndex: 10
                    }, {},{
                    	
                    }, {},{
                    	
                    }, {
                    	xtype: 'textfield',
                        fieldLabel: 'City' + (parameters.city.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'city',
                        allowBlank: parameters.city.presence !== 'mandatory',
                        tabIndex: 14
                    }, {
                    	xtype: 'textfield',
                        fieldLabel: 'Website' + (parameters.linkedin.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'linkedin',
                        allowBlank: parameters.linkedin.presence !== 'mandatory',
                        tabIndex: 16
                    }, {
                    	xtype: 'textfield',
                        fieldLabel: 'Fax nr.' + (parameters.faxnbr.presence === 'mandatory' ? ' (*)' : ''),
                        name: 'faxnbr',
                        allowBlank: parameters.faxnbr.presence !== 'mandatory',
                        tabIndex: 18
                    }]
            	}]
            }, {
            	id: 'captcha',
            	html: '<img src="' + this.catalogue.services.pdfCaptcha + '" />'
            }, {
            	xtype: 'button',
            	text: 'Refresh',
        		id: 'btnRefreshCaptcha',
        		//width: 300,
        		listeners: {
        			click: function(){
        				Ext.getCmp('captcha').update('<img src="' + self.catalogue.services.pdfCaptcha + '" />');
        			}
        		}
            }, {
            	layout: 'fit',
            	xtype: 'checkbox',
            	name: 'termsofuse',
            	boxLabel: 'Accept terms of use and privacy policy'
            }],
            
            // Reset and Submit buttons
            buttons: [{
            	text: 'Close',
            	handler: function() {
            		win.close();
            	}
            }, {
                text: 'Reset',
                handler: function() {
                    self.form.getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true, //only enabled once the form is valid
                disabled: false,
                handler: function() {
                    var form = self.form.getForm();
                    if (form.isValid()) {
                        form.submit({
                            success: function(form, action) {
                               Ext.Msg.alert('Success', action.result.msg);
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Failed', action.result.msg);
                            }
                        });
                    } else {
                        Ext.Msg.alert( "Error!", "Your form is invalid!" );
                    }
                }
            }]
        });
    	
    	var win = new Ext.Window({
            id: 'pdfRegisterWindow',
            layout: 'fit',
            width: 700,
            height: 500,
            closeAction: 'destroy',
            plain: true,
            modal: true,
            draggable: true,
            title: 'Registration',
            items: this.form,
            bodyStyle: 'background-color: white;'
        });
        win.show(this);
    },
    
    showPdfPasswordRecoveryWindow: function(){
    	var self = this;
    	this.passwordRecoveryForm = new Ext.form.FormPanel({
        	title: '',
            width: 400,
            frame: true,
            layout: 'form',
            
            url: this.catalogue.services.pdfPasswordRecovery,
            labelStyle: 'width:200px',
            
            items: [{
            	xtype: 'label',
            	text: OpenLayers.i18n('pdfPasswordRecovery'),
            	style: {
            		marginBottom: '10px',
            		textAlign: 'center'
            	}
            }, {
            	xtype: 'textfield',
                fieldLabel: 'E-mail address',
                name: 'emailAddress',
                allowBlank: false,
                tabIndex: 1
            }, {
            	id: 'captchaPasswordRecovery',
            	html: '<img src="' + this.catalogue.services.pdfCaptcha + '" />'
            }, {
            	xtype: 'button',
            	text: 'Refresh',
        		id: 'btnRefreshCaptchaPasswordRecovery',
        		//width: 300,
        		listeners: {
        			click: function(){
        				Ext.getCmp('captchaPasswordRecovery').update('<img src="' + self.catalogue.services.pdfCaptcha + '" />');
        			}
        		}
            }]
    	});
    	
    	var win = new Ext.Window({
            id: 'pdfPasswordRecoveryWindow',
            layout: 'fit',
            width: 700,
            height: 500,
            closeAction: 'destroy',
            plain: true,
            modal: true,
            draggable: true,
            title: 'Password recovery',
            items: this.passwordRecoveryForm,
            bodyStyle: 'background-color: white;'
        });
        win.show(this);
    }
});

/** api: xtype = gn_loginform */
Ext.reg('gn_loginform', GeoNetwork.LoginForm);