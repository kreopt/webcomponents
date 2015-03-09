!function(){
    var moving_handle=null;

    function on_handle_activate(slider, is_left){
        console.log("activate handle: ", this);
        var slider_rect = slider.slider.getBoundingClientRect();
        var slider_width = slider_rect.width;
        var scale_in_px = slider_width / slider.points;
        moving_handle = {
            handle:this,
            slider:slider,
            slider_width:slider_width,
            slider_rect: slider_rect,
            is_left:is_left,
            scale_in_px: scale_in_px,
            this_slider_rect: is_left?slider.left_handle.getBoundingClientRect():slider.handle.getBoundingClientRect(),
            max:is_left ?
                    slider.max*scale_in_px-1.5*slider.handle.getBoundingClientRect().width :
                    slider.min*scale_in_px+(slider.left_handle?1.5*slider.left_handle.getBoundingClientRect().width:0.5*slider.handle.getBoundingClientRect().width)
        };
        document.body.classList.add('no_ptr_events');
        document.addEventListener('mousemove', on_handle_move, true);
        document.addEventListener('mouseup', on_handle_deactivate, true);
    }
    function on_handle_deactivate(){
        document.body.classList.remove('no_ptr_events');
        moving_handle=null;
        document.removeEventListener('mousemove', on_handle_move, true);
        document.removeEventListener('mouseup', on_handle_deactivate, true);
    }
    function on_handle_move(e){
        var off = e.pageX-moving_handle.slider_rect.left;

        if (moving_handle.is_left){
            if (off < 0 || off > moving_handle.max) return;
            moving_handle.slider.setLeftPosition(Math.floor(off/moving_handle.scale_in_px));
        } else {
            if (off < moving_handle.max || off > moving_handle.slider_rect.width) return;
            moving_handle.slider.setPosition(Math.floor((moving_handle.slider_width-off)/moving_handle.scale_in_px));
        }
    }
    function scale_to_value(slider, scale_val){
        return scale_val*slider.scale + slider.min;
    }
    function value_to_scale(slider, val){
        return Math.floor((val-slider.min)/slider.scale);
    }

    var owner = (HTMLImports.currentScript || document.currentScript || {}).ownerDocument || document;
    var rangeProto = Object.create(HTMLElement.prototype, {
        startVal: {},
        endVal: {}
    });
    rangeProto.createdCallback = function(){
        var shadow = this;//.createShadowRoot();
        var tpl = owner.querySelector('#dg-range-slider_tpl--double');

        var clone = document.importNode(tpl.content, true);

        this.left_handle = clone.querySelector('.handle_left');
        this.handle = clone.querySelector('.handle_right');
        this.slider = clone.querySelector('.slider');
        this.slider_active = clone.querySelector('.slider_active');

        this.min = Number(this.getAttribute('min') || 0);
        this.max = Number(this.getAttribute('max') || 100);
        this.step = Number(this.getAttribute('step') || 1);
        this.points = (this.max - this.min) / this.step;

        this.init();
        shadow.appendChild(clone);
    };

    rangeProto.init = function(){
        this.left_handle.onmousedown = on_handle_activate.bind(this.left_handle, this, true);
        this.handle.onmousedown = on_handle_activate.bind(this.handle, this, false);
    };

    rangeProto.setPosition = function(val){
        if (val > this.max) {val = this.max;}
        if (val < this.min) {val = this.min;}
        this.slider_active.style.marginRight = Math.floor(val*(this.slider.getBoundingClientRect().width / this.points))+'px';
    };

    rangeProto.setLeftPosition = function(val){
        if (val > this.max) {val = this.max;}
        if (val < this.min) {val = this.min;}
        this.slider_active.style.marginLeft = Math.floor(val*(this.slider.getBoundingClientRect().width / this.points))+'px';
    };

    var sliderProto = Object.create(HTMLElement.prototype, {
        value: {
            get(){
                return this._value;
            },
            set(value){
                if (value > this.max) {value = this.max;}
                if (value < this.min) {value = this.min;}
                this._value = value;
                this.setPosition(value);
            }
        }
    });
    sliderProto.createdCallback = function(){
        var shadow = this;//.createShadowRoot();
        var tpl = owner.querySelector('#dg-range-slider_tpl--single');
        var clone = document.importNode(tpl.content, true);

        this.handle = clone.querySelector('.handle');
        this.slider = clone.querySelector('.slider');
        this.slider_active = clone.querySelector('.slider_active');

        this.min = Number(this.getAttribute('min') || 0);
        this.max = Number(this.getAttribute('max') || 100);
        this.step = Number(this.getAttribute('step') || 1);
        this.points = (this.max - this.min) / this.step;
        this._value = this.max;


        this.init();
        shadow.appendChild(clone);
    };

    sliderProto.init = function(){
        this.handle.onmousedown = on_handle_activate.bind(this.handle, this, false);
    };
    sliderProto.setPosition = function(val){
        if (val > this.max) {val = this.max;}
        if (val < this.min) {val = this.min;}
        this.slider_active.style.marginRight = Math.floor(val*(this.slider.getBoundingClientRect().width / this.points))+'px';
    };

    document.registerElement('dg-range',{
        prototype: rangeProto
    });
    document.registerElement('dg-slider',{
        prototype: sliderProto
    })
}();
