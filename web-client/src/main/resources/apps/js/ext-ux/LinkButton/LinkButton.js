/*
 * Ext JS Library 2.3.0
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
Ext.LinkButton = Ext.extend(Ext.Button, {

    template: new Ext.Template('<span><a href="void:new function(){}" target="{7}" style="color:#fff"><button>{0}</button></a></span>').compile(),

    buttonSelector : 'a:first',

    getTemplateArgs: function() {
        return Ext.Button.prototype.getTemplateArgs.apply(this).concat([this.href, this.target]);
    },

    onClick : function(e){
        if(e.button != 0){
            return;
        }
        if(!this.disabled){
            this.fireEvent("click", this, e);
            if(this.handler){
                this.handler.call(this.scope || this, this, e);
            }
        }
    }
});
Ext.reg('linkbutton', Ext.LinkButton);
