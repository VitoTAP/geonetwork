(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new 
	Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)
	[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-51119565-2', 'auto');
	  ga('send', 'pageview');

GeoNetwork.Settings = {};

// Default to absolute path without apps/search
GeoNetwork.URL = '../..';

//OpenLayers.ProxyHostURL = '/cgi-bin/proxy.cgi?url=';
// GeoNetwork proxy is much more permissive than OL one
OpenLayers.ProxyHostURL = '../../proxy?url=';

OpenLayers.ProxyHost = function(url){
    /**
     * Do not use proxy for local domain.
     * This is required to keep the session activated.
     */
    if (url && url.indexOf(window.location.host) != -1) {
        return url;
    } else {
        return OpenLayers.ProxyHostURL + encodeURIComponent(url);
    }
};


GeoNetwork.Util.defaultLocale = 'eng';
// Restrict locales to a subset of languages
//GeoNetwork.Util.locales = [
//            ['fr', 'Français']
//    ];
GeoNetwork.searchDefault = {
    activeMapControlExtent: false
};
GeoNetwork.advancedFormButton = true;

GeoNetwork.Settings.editor = {
    defaultViewMode : 'simple',
    editHarvested: false
//    defaultViewMode : 'inspire'
};

// Define if default mode should be used for HTML print output instead of tabs only
GeoNetwork.printDefaultForTabs = false;

// Define if label needs to be displayed for login form next to username/password fields
GeoNetwork.hideLoginLabels = false;


// Define which type of search to use
// Old mode (xml.search with lucene, db access and XSL formatting)
//GeoNetwork.Settings.mdStore = GeoNetwork.data.MetadataResultsStore;
// IndexOnly mode (xml.search with lucene only) - recommended
GeoNetwork.Settings.mdStore = GeoNetwork.data.MetadataResultsFastStore;


GeoNetwork.MapModule = true;
GeoNetwork.ProjectionList = [['EPSG:4326'/*, 'WGS84 (lat/lon)'*/]];
GeoNetwork.WMSList = [['Geoserver', 'http://localhost/geoserver/wms?']];

GeoNetwork.defaultViewMode = 'simple';

Ext.BLANK_IMAGE_URL = '../js/ext/resources/images/default/s.gif';

GeoNetwork.Settings.ratingEnabled = false;
GeoNetwork.Settings.isProduction = false;
GeoNetwork.Settings.nodeType = "BEL-AIR";
GeoNetwork.Settings.useSTS = false;
GeoNetwork.Settings.ga = true;
GeoNetwork.Settings.logoutUrlSTS = "https://auth." + (GeoNetwork.Settings.isProduction ? "" : "beta.") + "agiv.be/sts/";
GeoNetwork.Settings.nodeFooterInfo = "Build: 17/09/2014 - &copy; 2013-2014 - VITO NV. all rights reserved. <a target='_blank' href='http://www.vito-eodata.be/PDF/image/TermsOfUse.pdf'>Terms of use</a>";

