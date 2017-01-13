var geoConverter = geoConverter || {};

(function (GEO) {
    "use strict";

    var /* constants */
        PI = 3.14159265358979,
        /* Ellipsoid model constants (actual values here are for WGS84): */
        EarthRadius = 6378137.0,
        //add by wl-tsui
        TileSize = 256,
        InitialResolution = 2 * PI * EarthRadius / TileSize,
        OriginShift = 2 * PI * EarthRadius / 2,
        /* public functions */
        LatLonToMeters,
        PixelsToMeters,
        MetersToPixels,
        PixelsToTile,
        PixelsToRaster,
        Resolution,
        LatLonToTile,
        MetersToTile;
    LatLonToTile = function(lat, lon){
        var m = LatLonToMeters(lat,lon);
        return MetersToTile(m, 16);
    };

    LatLonToMeters = function (lat, lon) {
        var p = { 'x': 0, 'y': 0 };
        p.x = (lon * OriginShift / 180);
        p.y = (Math.log(Math.tan((90 + lat) * PI / 360)) / (PI / 180));
        p.y = (p.y * OriginShift / 180);
        return p;
    };

    //Converts pixel coordinates in given zoom level of pyramid to EPSG:900913
    PixelsToMeters = function (p, zoom) {
        var res = Resolution(zoom);
        var met = { 'x': 0, 'y': y };
        met.x = (p.x * res - OriginShift);
        met.y = -(p.y * res - OriginShift);
        return met;
    };

    //Converts EPSG:900913 to pyramid pixel coordinates in given zoom level
    MetersToPixels = function (m, zoom) {
        var res = Resolution(zoom);
        var pix = { 'x': 0, 'y': 0 };
        pix.x = ((m.x + OriginShift) / res);
        pix.y = ((-m.y + OriginShift) / res);
        return pix;
    };

    //Returns a TMS (NOT Google!) tile covering region in given pixel coordinates
    PixelsToTile = function (p) {
        var t = { 'x': 0, 'y': 0 };
        t.x = Math.ceil(p.x / TileSize) - 1;
        t.y = Math.ceil(p.y / TileSize) - 1;
        return t;
    };

    PixelsToRaster = function (p, zoom) {
        var mapSize = TileSize << zoom;
        return new Vector2d(p.x, mapSize - p.y);
    };

    //Returns tile for given mercator coordinates
    MetersToTile = function (m, zoom) {
        var p = MetersToPixels(m, zoom);
        return PixelsToTile(p);
    };

    //Returns bounds of the given tile in latutude/longitude using WGS84 datum
    //public static Rect TileLatLonBounds(Vector2d t, int zoom)
    //{
    //    var bound = TileBounds(t, zoom);
    //    var min = MetersToLatLon(new Vector2d(bound.xMin, bound.yMin));
    //    var max = MetersToLatLon(new Vector2d(bound.xMax, bound.yMax));
    //    return new Rect(min.x, min.y, Math.Abs(max.x - min.x), Math.Abs(max.y - min.y));
    //}

    //Resolution (meters/pixel) for given zoom level (measured at Equator)
    Resolution = function (zoom) {
        return InitialResolution / (Math.pow(2, zoom));
    };

    // public static double ZoomForPixelSize(double pixelSize)
    // {
    //     for (var i = 0; i < 30; i++)
    //         if (pixelSize > Resolution(i))
    //             return i != 0 ? i - 1 : 0;
    //     throw new InvalidOperationException();
    // }

    // // Switch to Google Tile representation from TMS
    // public static Vector2d ToGoogleTile(Vector2d t, int zoom)
    // {
    //     return new Vector2d(t.x, ((int)Math.Pow(2, zoom) - 1) - t.y);
    // }

    // // Switch to TMS Tile representation from Google
    // public static Vector2d ToTmsTile(Vector2d t, int zoom)
    // {
    //     return new Vector2d(t.x, ((int)Math.Pow(2, zoom) - 1) - t.y);
    // }

    GEO.LatLonToMeters = LatLonToMeters;
    GEO.MetersToTile = MetersToTile;
    GEO.LatLonToTile = LatLonToTile;
})(geoConverter);

module.exports = {
    LatLonToTile: geoConverter.LatLonToTile
}