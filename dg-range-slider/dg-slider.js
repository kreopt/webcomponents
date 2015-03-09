!function(){
    var moving_handle=null;

    function scale_to_value(slider, scale_val){
        return scale_val*slider.scale + slider.min;
    }
    function value_to_scale(slider, val){
        return Math.floor((val-slider.min)/slider.scale);
    }

    var owner = (HTMLImports.currentScript || document.currentScript || {}).ownerDocument || document;


    var sliderProto = Object.create(HTMLElement.prototype, {
        value: {
            get: function(){
                return this._value;
            },
            set: function(value){
                if (value > this.max) {value = this.max;}
                if (value < this.min) {value = this.min;}
                this._value = value;
                this.setPosition(value);
            }
        }
    });

    sliderProto.on_handle_activate = function(){
        document.body.style['pointerEvents'] = 'none';
        document.addEventListener('mousemove', this.on_handle_move_handler, true);
        document.addEventListener('mouseup', this.on_handle_deactivate_handler, true);
    };

    sliderProto.on_handle_deactivate = function(){
        document.body.style['pointerEvents'] = '';
        document.removeEventListener('mousemove', this.on_handle_move_handler, true);
        document.removeEventListener('mouseup', this.on_handle_deactivate_handler, true);
    };

    sliderProto.on_handle_move = function(e){
        var slider_rect = this.slider.getBoundingClientRect();
        var off = e.pageX-slider_rect.left;
        var scale_in_px = slider_rect.width / this.points;
        if (off < 0 || off > slider_rect.width) return;
        this.setPosition(Math.floor((off)/scale_in_px)*this.step+this.min);
    };

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
        this.on_handle_move_handler = this.on_handle_move.bind(this);
        this.on_handle_deactivate_handler = this.on_handle_deactivate.bind(this);


        this.init();
        shadow.appendChild(clone);
    };

    sliderProto.init = function(){
        this.handle.onmousedown = this.on_handle_activate.bind(this);
        var _this = this;
        this.slider.addEventListener('click',function(e){
            _this.on_handle_move(e);
        }, false);
    };

    sliderProto.setPosition = function(val){
        if (val > this.max) {val = this.max;}
        if (val < this.min) {val = this.min;}
        var handle_off = 0.5*this.handle.getBoundingClientRect().width;

        this.slider_active.style.marginRight = Math.floor(((this.max-val)/this.step)*(this.slider.getBoundingClientRect().width / this.points))+'px';
        this._value = val;

        var evt = new CustomEvent('changed', {detail:{value: val}});
        this.dispatchEvent(evt);
    };

    document.registerElement('dg-slider',{
        prototype: sliderProto
    })
}();
