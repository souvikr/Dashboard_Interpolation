/*
 (c) 2016, Manuel Bär (www.geonet.ch)
 Leaflet.idw, a tiny and fast inverse distance weighting plugin for Leaflet.
 Largely based on the source code of Leaflet.heat by Vladimir Agafonkin (c) 2014
 https://github.com/Leaflet/Leaflet.heat
 version: 0.0.2
*/
!function(){
"use strict";

    function simpleidw(canvas) {
        if (!(this instanceof simpleidw)) return new simpleidw(canvas);

        this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;

        this._max = 1;
        this._data = [];
    }
    
    simpleidw.prototype = {

        defaultCellSize: 25,

        defaultGradient: {
            0.0: '#008000',
 0.00390625: '#038100',
 0.0078125: '#068300',
 0.01171875: '#098400',
 0.015625: '#0c8600',
 0.01953125: '#0f8700',
 0.0234375: '#128900',
 0.02734375: '#158a00',
 0.03125: '#188c00',
 0.03515625: '#1b8d00',
 0.0390625: '#1e8f00',
 0.04296875: '#219000',
 0.046875: '#249200',
 0.05078125: '#279300',
 0.0546875: '#2a9500',
 0.05859375: '#2d9600',
 0.0625: '#309800',
 0.06640625: '#339900',
 0.0703125: '#369b00',
 0.07421875: '#399c00',
 0.078125: '#3c9e00',
 0.08203125: '#3f9f00',
 0.0859375: '#42a100',
 0.08984375: '#45a200',
 0.09375: '#48a400',
 0.09765625: '#4ba500',
 0.1015625: '#4ea700',
 0.10546875: '#51a800',
 0.109375: '#54aa00',
 0.11328125: '#57ab00',
 0.1171875: '#5aad00',
 0.12109375: '#5dae00',
 0.125: '#60b000',
 0.12890625: '#63b100',
 0.1328125: '#66b300',
 0.13671875: '#69b400',
 0.140625: '#6cb600',
 0.14453125: '#6fb700',
 0.1484375: '#72b900',
 0.15234375: '#75ba00',
 0.15625: '#78bc00',
 0.16015625: '#7bbd00',
 0.1640625: '#7ebf00',
 0.16796875: '#81c000',
 0.171875: '#84c200',
 0.17578125: '#87c300',
 0.1796875: '#8ac500',
 0.18359375: '#8dc600',
 0.1875: '#90c800',
 0.19140625: '#93c900',
 0.1953125: '#96cb00',
 0.19921875: '#99cc00',
 0.203125: '#9cce00',
 0.20703125: '#9fcf00',
 0.2109375: '#a2d100',
 0.21484375: '#a5d200',
 0.21875: '#a8d400',
 0.22265625: '#abd500',
 0.2265625: '#aed700',
 0.23046875: '#b1d800',
 0.234375: '#b4da00',
 0.23828125: '#b7db00',
 0.2421875: '#badd00',
 0.24609375: '#bdde00',
 0.25: '#c0e000',
 0.25390625: '#c3e100',
 0.2578125: '#c6e300',
 0.26171875: '#c9e400',
 0.265625: '#cce600',
 0.26953125: '#cfe700',
 0.2734375: '#d2e900',
 0.27734375: '#d5ea00',
 0.28125: '#d8ec00',
 0.28515625: '#dbed00',
 0.2890625: '#deef00',
 0.29296875: '#e1f000',
 0.296875: '#e4f200',
 0.30078125: '#e7f300',
 0.3046875: '#eaf500',
 0.30859375: '#edf600',
 0.3125: '#f0f800',
 0.31640625: '#f3f900',
 0.3203125: '#f6fb00',
 0.32421875: '#f9fc00',
 0.328125: '#fcfe00',
 0.33203125: '#ffff00',
 0.3359375: '#fffe00',
 0.33984375: '#fffd00',
 0.34375: '#fffc00',
 0.34765625: '#fffb00',
 0.3515625: '#fffa00',
 0.35546875: '#fff900',
 0.359375: '#fff800',
 0.36328125: '#fff700',
 0.3671875: '#fff500',
 0.37109375: '#fff400',
 0.375: '#fff300',
 0.37890625: '#fff200',
 0.3828125: '#fff100',
 0.38671875: '#fff000',
 0.390625: '#ffef00',
 0.39453125: '#ffee00',
 0.3984375: '#ffed00',
 0.40234375: '#ffec00',
 0.40625: '#ffeb00',
 0.41015625: '#ffea00',
 0.4140625: '#ffe900',
 0.41796875: '#ffe800',
 0.421875: '#ffe700',
 0.42578125: '#ffe600',
 0.4296875: '#ffe500',
 0.43359375: '#ffe300',
 0.4375: '#ffe200',
 0.44140625: '#ffe100',
 0.4453125: '#ffe000',
 0.44921875: '#ffdf00',
 0.453125: '#ffde00',
 0.45703125: '#ffdd00',
 0.4609375: '#ffdc00',
 0.46484375: '#ffdb00',
 0.46875: '#ffda00',
 0.47265625: '#ffd900',
 0.4765625: '#ffd800',
 0.48046875: '#ffd700',
 0.484375: '#ffd600',
 0.48828125: '#ffd500',
 0.4921875: '#ffd400',
 0.49609375: '#ffd300',
 0.5: '#ffd100',
 0.50390625: '#ffd000',
 0.5078125: '#ffcf00',
 0.51171875: '#ffce00',
 0.515625: '#ffcd00',
 0.51953125: '#ffcc00',
 0.5234375: '#ffcb00',
 0.52734375: '#ffca00',
 0.53125: '#ffc900',
 0.53515625: '#ffc800',
 0.5390625: '#ffc700',
 0.54296875: '#ffc600',
 0.546875: '#ffc500',
 0.55078125: '#ffc400',
 0.5546875: '#ffc300',
 0.55859375: '#ffc200',
 0.5625: '#ffc100',
 0.56640625: '#ffbf00',
 0.5703125: '#ffbe00',
 0.57421875: '#ffbd00',
 0.578125: '#ffbc00',
 0.58203125: '#ffbb00',
 0.5859375: '#ffba00',
 0.58984375: '#ffb900',
 0.59375: '#ffb800',
 0.59765625: '#ffb700',
 0.6015625: '#ffb600',
 0.60546875: '#ffb500',
 0.609375: '#ffb400',
 0.61328125: '#ffb300',
 0.6171875: '#ffb200',
 0.62109375: '#ffb100',
 0.625: '#ffb000',
 0.62890625: '#ffaf00',
 0.6328125: '#ffad00',
 0.63671875: '#ffac00',
 0.640625: '#ffab00',
 0.64453125: '#ffaa00',
 0.6484375: '#ffa900',
 0.65234375: '#ffa800',
 0.65625: '#ffa700',
 0.66015625: '#ffa600',
 0.6640625: '#ffa500',
 0.66796875: '#ffa300',
 0.671875: '#ffa100',
 0.67578125: '#ff9f00',
 0.6796875: '#ff9d00',
 0.68359375: '#ff9b00',
 0.6875: '#ff9900',
 0.69140625: '#ff9700',
 0.6953125: '#ff9500',
 0.69921875: '#ff9400',
 0.703125: '#ff9200',
 0.70703125: '#ff9000',
 0.7109375: '#ff8e00',
 0.71484375: '#ff8c00',
 0.71875: '#ff8a00',
 0.72265625: '#ff8800',
 0.7265625: '#ff8600',
 0.73046875: '#ff8400',
 0.734375: '#ff8200',
 0.73828125: '#ff8000',
 0.7421875: '#ff7e00',
 0.74609375: '#ff7c00',
 0.75: '#ff7a00',
 0.75390625: '#ff7800',
 0.7578125: '#ff7600',
 0.76171875: '#ff7400',
 0.765625: '#ff7300',
 0.76953125: '#ff7100',
 0.7734375: '#ff6f00',
 0.77734375: '#ff6d00',
 0.78125: '#ff6b00',
 0.78515625: '#ff6900',
 0.7890625: '#ff6700',
 0.79296875: '#ff6500',
 0.796875: '#ff6300',
 0.80078125: '#ff6100',
 0.8046875: '#ff5f00',
 0.80859375: '#ff5d00',
 0.8125: '#ff5b00',
 0.81640625: '#ff5900',
 0.8203125: '#ff5700',
 0.82421875: '#ff5500',
 0.828125: '#ff5300',
 0.83203125: '#ff5200',
 0.8359375: '#ff5000',
 0.83984375: '#ff4e00',
 0.84375: '#ff4c00',
 0.84765625: '#ff4a00',
 0.8515625: '#ff4800',
 0.85546875: '#ff4600',
 0.859375: '#ff4400',
 0.86328125: '#ff4200',
 0.8671875: '#ff4000',
 0.87109375: '#ff3e00',
 0.875: '#ff3c00',
 0.87890625: '#ff3a00',
 0.8828125: '#ff3800',
 0.88671875: '#ff3600',
 0.890625: '#ff3400',
 0.89453125: '#ff3200',
 0.8984375: '#ff3100',
 0.90234375: '#ff2f00',
 0.90625: '#ff2d00',
 0.91015625: '#ff2b00',
 0.9140625: '#ff2900',
 0.91796875: '#ff2700',
 0.921875: '#ff2500',
 0.92578125: '#ff2300',
 0.9296875: '#ff2100',
 0.93359375: '#ff1f00',
 0.9375: '#ff1d00',
 0.94140625: '#ff1b00',
 0.9453125: '#ff1900',
 0.94921875: '#ff1700',
 0.953125: '#ff1500',
 0.95703125: '#ff1300',
 0.9609375: '#ff1100',
 0.96484375: '#ff1000',
 0.96875: '#ff0e00',
 0.97265625: '#ff0c00',
 0.9765625: '#ff0a00',
 0.98046875: '#ff0800',
 0.984375: '#ff0600',
 0.98828125: '#ff0400',
 0.9921875: '#ff0200',
 0.99609375: '#ff0000'
        },

        data: function (data) {
            this._data = data;
            return this;
        },

        max: function (max) {
            this._max = max;
            return this;
        },

        add: function (point) {
            this._data.push(point);
            return this;
        },

        clear: function () {
            this._data = [];
            return this;
        },

        cellSize: function (r) {
            // create a grayscale blurred cell image that we'll use for drawing points
            var cell = this._cell = document.createElement("canvas"),
                ctx = cell.getContext('2d');
                this._r = r;

            cell.width = cell.height = r;

            ctx.beginPath();
            ctx.rect(0, 0, r, r);
            ctx.fill();
            ctx.closePath();

            return this;
        },

        resize: function () {
            this._width = this._canvas.width;
            this._height = this._canvas.height;
        },

        gradient: function (grad) {
            // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext('2d'),
                gradient = ctx.createLinearGradient(0, 0, 0, 256);

            canvas.width = 1;
            canvas.height = 256;

            for (var i in grad) {
                gradient.addColorStop(+i, grad[i]);
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1, 256);

            this._grad = ctx.getImageData(0, 0, 1, 256).data;

            return this;
        },

        draw: function (opacity) {
            if (!this._cell) this.cellSize(this.defaultCellSize);
            if (!this._grad) this.gradient(this.defaultGradient);
            
            var ctx = this._ctx;

            ctx.clearRect(0, 0, this._width, this._height);

            // draw a grayscale idwmap by putting a cell at each data point
            for (var i = 0, len = this._data.length, p; i < len; i++) {
                p = this._data[i];
                ctx.globalAlpha = p[2] / this._max;
                ctx.drawImage(this._cell, p[0] - this._r, p[1] - this._r);
            }

            // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
            var colored = ctx.getImageData(0, 0, this._width, this._height);
            this._colorize(colored.data, this._grad, opacity);
            
            ctx.putImageData(colored, 0, 0);

            return this;
        },

        _colorize: function (pixels, gradient, opacity) {
            for (var i = 0, len = pixels.length, j; i < len; i += 4) {
                j = pixels[i + 3] * 4; 

                    pixels[i] = gradient[j];
                    pixels[i + 1] = gradient[j + 1];
                    pixels[i + 2] = gradient[j + 2];
                    pixels[i + 3] = opacity*256;
            }
        }
    },
    window.simpleidw = simpleidw
}(),

L.IdwLayer = (L.Layer ? L.Layer : L.Class).extend({
    /*
    options: {
        opacity: 0.5,
        maxZoom: 18,
        cellSize: 1,
        exp: 2,
        max: 100
    },
    */
    initialize: function (latlngs, options) {
        this._latlngs = latlngs;
        L.setOptions(this, options);
    },

    setLatLngs: function (latlngs) {
        this._latlngs = latlngs;
        return this.redraw();
    },

    addLatLng: function (latlng) {
        this._latlngs.push(latlng);
        return this.redraw();
    },

    setOptions: function (options) {
        L.setOptions(this, options);
        if (this._idw) {
            this._updateOptions();
        }
        return this.redraw();
    },

    redraw: function () {
        if (this._idw && !this._frame && !this._map._animating) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    },

    onAdd: function (map) {
        this._map = map;

        if (!this._canvas) {
            this._initCanvas();
        }

        map._panes.overlayPane.appendChild(this._canvas);

        map.on('moveend', this._reset, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        this._reset();
    },

    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._canvas);

        map.off('moveend', this._reset, this);

        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    _initCanvas: function () {
        var canvas = this._canvas = L.DomUtil.create('canvas', 'leaflet-idwmap-layer leaflet-layer');

        var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        canvas.style[originProp] = '50% 50%';

        var size = this._map.getSize();
        canvas.width  = size.x;
        canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

        this._idw = simpleidw(canvas);
        this._updateOptions();
    },

    _updateOptions: function () {
        this._idw.cellSize(this.options.cellSize || this._idw.defaultCellSize);

        if (this.options.gradient) {
            this._idw.gradient(this.options.gradient);
        }
        if (this.options.max) {
            this._idw.max(this.options.max);
        }
    },

    _reset: function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);

        var size = this._map.getSize();

        if (this._idw._width !== size.x) {
            this._canvas.width = this._idw._width  = size.x;
        }
        if (this._idw._height !== size.y) {
            this._canvas.height = this._idw._height = size.y;
        }

        this._redraw();
    },

    _redraw: function () {
        if (!this._map) {
            return;
        }
        var data = [],
            r = this._idw._r,
            size = this._map.getSize(),
            bounds = new L.Bounds(
                L.point([-r, -r]),
                size.add([r, r])),

            exp = this.options.exp === undefined ? 1 : this.options.exp,
            max = this.options.max === undefined ? 1 : this.options.max,
            maxZoom = this.options.maxZoom === undefined ? this._map.getMaxZoom() : this.options.maxZoom,
            v = 1, 
            cellCen = r / 2,
            grid = [],
            nCellX = Math.ceil((bounds.max.x-bounds.min.x)/r)+1,
            nCellY = Math.ceil((bounds.max.y-bounds.min.y)/r)+1,
            panePos = this._map._getMapPanePos(),

            offsetX = 0, 
            offsetY = 0,
            i, len, p, cell, x, y, j, len2, k;
            
            console.log(nCellX);
            console.log(nCellY);
            
            console.time('process');
        
        for (i = 0, len = nCellY; i < len; i++) {
            for (j = 0, len2 = nCellX; j < len2; j++) {     
            
                var x=i*r,y=j*r;
                var numerator=0,denominator=0;
                
                for (k = 0, len3 = this._latlngs.length; k < len3; k++) {          
                
                    var p = this._map.latLngToContainerPoint(this._latlngs[k]);                    
                    var cp = L.point((y-cellCen), (x-cellCen));                    
                    var dist = cp.distanceTo(p);
                    
                    var val =
                            this._latlngs[k].alt !== undefined ? this._latlngs[k].alt :
                            this._latlngs[k][2] !== undefined ? +this._latlngs[k][2] : 1;
                    
                    if(dist===0){
                            numerator = val;
                            denominator = 1;
                            break;
                    }
                    
                    var dist2 = Math.pow(dist, exp);

                    numerator += (val/dist2);
                    denominator += (1/dist2);             
                            
                }
                
                interpolVal = numerator/denominator;
                
                cell = [j*r, i*r, interpolVal];
                
                if (cell) {
                    data.push([
                        Math.round(cell[0]),
                        Math.round(cell[1]),
                        Math.min(cell[2], max)
                    ]);
                }
            }
        }
        console.timeEnd('process');
        console.time('draw ' + data.length);
        this._idw.data(data).draw(this.options.opacity);
        console.timeEnd('draw ' + data.length);

        this._frame = null;
    },

    _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

        if (L.DomUtil.setTransform) {
            L.DomUtil.setTransform(this._canvas, offset, scale);

        } else {
            this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
        }
    }
});

L.idwLayer = function (latlngs, options) {
    return new L.IdwLayer(latlngs, options);
};