!function(){
    var sliders={};
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
            this_slider_rect: is_left?slider.left_handle.getBoundingClientRect():slider.right_handle.getBoundingClientRect(),
            max:is_left ?
                    slider.right_val*scale_in_px-1.5*slider.right_handle.getBoundingClientRect().width :
                    slider.left_val*scale_in_px+1.5*slider.left_handle.getBoundingClientRect().width
        };
        document.body.classList.add('no_ptr_events');
        document.addEventListener('mousemove', on_handle_move, true);
        document.addEventListener('mouseup', on_handle_deactivate, true);
    }
    function on_handle_deactivate(){
        console.log("deactivate handle");
        document.body.classList.remove('no_ptr_events');
        moving_handle=null;
        document.removeEventListener('mousemove', on_handle_move, true);
        document.removeEventListener('mouseup', on_handle_deactivate, true);
    }
    function on_handle_move(e){
        var off = e.pageX-moving_handle.slider_rect.left;

        if (moving_handle.is_left){
            if (off < 0 || off > moving_handle.max) return;
            var scales = Math.floor(off/moving_handle.scale_in_px);
            moving_handle.slider.slider_active.style.marginLeft = (scales*moving_handle.scale_in_px)+'px';
            moving_handle.slider.left_val_view.value = scale_to_value(moving_handle.slider, scales);
        } else {
            if (off < moving_handle.max || off > moving_handle.slider_rect.width) return;
            scales = Math.ceil(off/moving_handle.scale_in_px);
            moving_handle.slider.slider_active.style.marginRight = (Math.floor((moving_handle.slider_width-off)/moving_handle.scale_in_px)*moving_handle.scale_in_px )+'px';
            moving_handle.slider.right_val_view.value = scale_to_value(moving_handle.slider, scales);
        }
    }
    function scale_to_value(slider, scale_val){
        return scale_val*slider.scale + slider.min;
    }
    function value_to_scale(slider, val){
        return Math.floor((val-slider.min)/slider.scale);
    }

    init_slider = function(id, min, max, scale){
        var el = document.getElementById(id);
        var values = el.getElementsByClassName('slider_values')[0];

        sliders[id]={
            min:Number(min), max:Number(max), scale:Number(scale), points:Math.floor((max-min)/scale),
            element: el,
            slider: el.getElementsByClassName('slider')[0],
            slider_active: el.getElementsByClassName('slider_active')[0],
            left_handle: el.getElementsByClassName('handle_left')[0],
            right_handle: el.getElementsByClassName('handle_right')[0],
            left_val:0,
            right_val:Math.floor((max-min)/scale),
            left_val_view: values.getElementsByClassName('slider_from')[0],
            right_val_view: values.getElementsByClassName('slider_to')[0]
        };
        sliders[id].left_handle.onmousedown=on_handle_activate.bind(sliders[id].left_handle, sliders[id], true);
        sliders[id].right_handle.onmousedown=on_handle_activate.bind(sliders[id].right_handle, sliders[id], false);
        sliders[id].left_val_view.value = scale_to_value(sliders[id], sliders[id].left_val);
        sliders[id].right_val_view.value = scale_to_value(sliders[id], sliders[id].right_val);
    }
    
    
    var owner = (HTMLImports.currentScript || document.currentScript || {}).ownerDocument || document;
    var spinnerProto = Object.create(HTMLElement.prototype);
    spinnerProto.createdCallback = function(){
        var shadow = this;//.createShadowRoot();
        var tpl = owner.querySelector('#spinner_template');
        var clone = document.importNode(tpl.content, true);
        shadow.appendChild(clone);
    };
    document.registerElement('sf-spinner',{
        prototype: spinnerProto
    })
}();
