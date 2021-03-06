OpenLayers.DOTS_PER_INCH = 90.71;
//OpenLayers.ImgPath = '../js/OpenLayers/theme/default/img/';
OpenLayers.ImgPath = '../js/OpenLayers/img/';

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

// Define a constant with the base url to the MapFish web service.
//mapfish.SERVER_BASE_URL = '../../../../../'; // '../../';

// Remove pink background when a tile fails to load
OpenLayers.Util.onImageLoadErrorColor = "transparent";

// Lang (sets also OpenLayers.Lang)
GeoNetwork.Util.setLang(GeoNetwork.Util.defaultLocale, '..');

OpenLayers.Util.onImageLoadError = function() {
	this._attempts = (this._attempts) ? (this._attempts + 1) : 1;
	if (this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
		this.src = this.src;
	} else {
		this.style.backgroundColor = OpenLayers.Util.onImageLoadErrorColor;
		this.style.display = "none";
	}
};

// add Proj4js.defs here
// Proj4js.defs["EPSG:27572"] = "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs";
Proj4js.defs["EPSG:2154"] = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
//new OpenLayers.Projection("EPSG:900913")


GeoNetwork.map.printCapabilities = "../../pdf";

// Config for WGS84 based maps
GeoNetwork.map.PROJECTION = "EPSG:4326";
//GeoNetwork.map.UNITS = "dd"; //degrees
GeoNetwork.map.UNITS = "m"; //meter

//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(2.55791, 50.67460, 5.92000, 51.49600);
//GeoNetwork.map.RESTRICTEDEXTENT = new OpenLayers.Bounds(2.31580, 49.31776, 6.66271, 51.64241);
GeoNetwork.map.RESTRICTEDEXTENT = new OpenLayers.Bounds(-180, -90, 180, 90);
//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(2.31580, 49.31776, 6.66271, 51.64241);
GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-180, -90, 180, 90);
GeoNetwork.map.scales = [250000000, 100000000, 75000000, 50000000 ,25000000, 10000000, 7500000, 5000000, 2500000, 1000000, 750000, 500000, 250000, 100000, 75000, 50000, 25000, 10000, 7500, 5000, 2500, 1000, 750, 500, 250];


//GeoNetwork.map.RESOLUTIONS = [/*1.40625000000000000000, 0.70312500000000000000, 0.35156250000000000000, 0.17578125000000000000, 0.08789062500000000000, */0.04394531250000000000, 0.02197265625000000000, 0.01098632812500000000, 0.00549316406250000000, 0.00274658203125000000, 0.00137329101562500000, 0.00068664550781250000, 0.00034332275390625000, 0.00017166137695312500, 0.00008583068847656250, 0.00004291534423828120, 0.00002145767211914060, 0.00001072883605957030, 0.00000536441802978516, 0.00000268220901489258, 0.00000134110450744629, 0.00000067055225372314, 0.00000033527612686157];
GeoNetwork.map.RESOLUTIONS = [2.8125000000000000000, 1.40625000000000000000, 0.70312500000000000000, 0.35156250000000000000, 0.17578125000000000000, 0.08789062500000000000, 0.04394531250000000000, 0.02197265625000000000, 0.01098632812500000000, 0.00549316406250000000, 0.00274658203125000000, 0.00137329101562500000, 0.00068664550781250000, 0.00034332275390625000, 0.00017166137695312500, 0.00008583068847656250, 0.00004291534423828120, 0.00002145767211914060, 0.00001072883605957030, 0.00000536441802978516, 0.00000268220901489258, 0.00000134110450744629, 0.00000067055225372314, 0.00000033527612686157, 0.000000167638063430785, 0.0000000838190317153925];
//GeoNetwork.map.MAXRESOLUTION = 0.04394531250000000000;
GeoNetwork.map.MAXRESOLUTION = 2.8125000000000000000;
GeoNetwork.map.NUMZOOMLEVELS = 15;
//GeoNetwork.map.NUMZOOMLEVELS = 23;
GeoNetwork.map.TILESIZE = new OpenLayers.Size(256,256);

GeoNetwork.map.BACKGROUND_LAYERS=[
//	new OpenLayers.Layer.Google("Google Physical", {type: google.maps.MapTypeId.TERRAIN, minZoomLevel: 1,isBaseLayer: true }),
new OpenLayers.Layer.Google("Google Streets", {"sphericalMercator": true, numZoomLevels: 20,minZoomLevel: 1,isBaseLayer: true}),
new OpenLayers.Layer.Google("Google Hybrid", {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20, minZoomLevel: 1,isBaseLayer: true}),
new OpenLayers.Layer.Google("Google Satellite", {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22, minZoomLevel: 1,isBaseLayer: true})
/*
	new OpenLayers.Layer.WMS('OSM', 'http://129.206.228.72/cached/osm', {layers: 'osm_auto:all', format: 'image/jpeg'}, {isBaseLayer: true}),
      new OpenLayers.Layer.WMS('Demis WorldMap', 'http://demis.vito.be/wms/wms.ashx', {layers: 'Bathymetry,Topography,Hillshading,Coastlines,Borders', format: 'image/jpeg'}, {isBaseLayer: true}),
      new OpenLayers.Layer.WMS('mapbender', 'http://mapbender.wheregroup.com/cgi-bin/mapserv?map=/data/umn/osm/osm_basic.map', {layers: 'osm_basic', format: 'image/jpeg'}, {isBaseLayer: true}),
      new OpenLayers.Layer.WMS('OSM irs', 'http://irs.gis-lab.info', {layers: 'osm', format: 'image/jpeg'}, {isBaseLayer: true})
*/
    ];

// Config for OSM based maps
GeoNetwork.map.PROJECTION = "EPSG:900913";
//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-550000, 5000000, 1200000, 7000000);
//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(2.31580, 49.31776, 6.66271, 51.64241).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
GeoNetwork.map.RESTRICTEDEXTENT = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);;
GeoNetwork.map.EXTENT = GeoNetwork.map.RESTRICTEDEXTENT;
//GeoNetwork.map.BACKGROUND_LAYERS = [
//    new OpenLayers.Layer.OSM()
//    //new OpenLayers.Layer.Google("Google Streets");
//    ];

//* DEMIS country layer
//GeoNetwork.map.OWS = "../../maps/demis.xml";

//GeoNetwork.map.CONTEXT = "../../maps/geoserver_localhost.wmc";

GeoNetwork.map.CONTEXT_MAP_OPTIONS = {
  controls: [],
  theme:null
};

GeoNetwork.map.CONTEXT_MAIN_MAP_OPTIONS = {
  controls: [],
  theme:null
};

GeoNetwork.map.EXTENT_MAP_OPTIONS = {
    projection: GeoNetwork.map.PROJECTION,
    units: GeoNetwork.map.UNITS,
//    resolutions: GeoNetwork.map.RESOLUTIONS,
//    maxResolution: GeoNetwork.map.MAXRESOLUTION,
//    numZoomLevels: GeoNetwork.map.NUMZOOMLEVELS,
	tileSize: GeoNetwork.map.TILESIZE,
//	controls: [],
	scales: GeoNetwork.map.scales,
	maxExtent: GeoNetwork.map.EXTENT,
	restrictedExtent: GeoNetwork.map.RESTRICTEDEXTENT
};
GeoNetwork.map.MAP_OPTIONS = {
    projection: GeoNetwork.map.PROJECTION,
    units: GeoNetwork.map.UNITS,
//    resolutions: GeoNetwork.map.RESOLUTIONS,
//    maxResolution: GeoNetwork.map.MAXRESOLUTION,
//    numZoomLevels: GeoNetwork.map.NUMZOOMLEVELS,
	tileSize: GeoNetwork.map.TILESIZE,
	controls: [],
	scales: GeoNetwork.map.scales,
	maxExtent: GeoNetwork.map.EXTENT,
	restrictedExtent: GeoNetwork.map.RESTRICTEDEXTENT
};
GeoNetwork.map.MAIN_MAP_OPTIONS = {
    projection: GeoNetwork.map.PROJECTION,
    units: GeoNetwork.map.UNITS,
//    resolutions: GeoNetwork.map.RESOLUTIONS,
//    maxResolution: GeoNetwork.map.MAXRESOLUTION,
//    numZoomLevels: GeoNetwork.map.NUMZOOMLEVELS,
	tileSize: GeoNetwork.map.TILESIZE,
	controls: [],
	scales: GeoNetwork.map.scales,
	maxExtent: GeoNetwork.map.EXTENT,
	restrictedExtent: GeoNetwork.map.RESTRICTEDEXTENT
};
