!function () {
    var owner = (document.currentScript || {}).ownerDocument || document;
    $(owner).ready(function(){
        var sfAjaxFormProto = Object.create(HTMLFormElement.prototype, {});

        sfAjaxFormProto.submit = function (e) {
            e.preventDefault();
            if (!this.checkValidity()){
                return
            }

            var fd = new FormData(this);
            var url = this.getAttribute('action') || "";
            var method = this.getAttribute('method') || "POST";
            var data_type = this.getAttribute('type') || "text";
            var _this = this;
            var buttons = this.getElementsByTagName('button');
            buttons.forEach(function(e){
                e.setAttribute('disabled', 'disabled');
            });
            $.ajax({
                url: url,
                type:method,
                data: fd,
                dataType: data_type,
                processData: false,
                success: function(r){
                    var evt = new CustomEvent("success", {detail:{response:r}});
                    _this.dispatchEvent(evt);
                    buttons.forEach(function(e){
                        e.removeAttribute('disabled');
                    });
                },
                error: function(e){
                    var evt = new CustomEvent("error", {detail:{error:e}});
                    _this.dispatchEvent(evt);
                    buttons.forEach(function(e){
                        e.removeAttribute('disabled');
                    });
                }
            })
        };

        sfAjaxFormProto.createdCallback = function () {
            console.log('created');
            //var t = owner.querySelector('#ajax_form_template');
            //var clone = owner.importNode(t.content, true);
            //var shadow = this.createShadowRoot();
            //shadow.appendChild(clone);
            //this.addEventListener('click', function(e){
            //    var el = e.target;
            //    if (el && el.tagName == 'BUTTON' && el.type=="submit") {
            //        var evt = new Event("submit");
            //        this.dispatchEvent(evt);
            //    }
            //
            //}, false);
            this.addEventListener('submit',this.submit, false);
        };

        sfAjaxFormProto.attachedCallback = function () {
            console.log('attached');
        };

        sfAjaxFormProto.detachedCallback = function () {
            console.log('detached');
        };

        sfAjaxFormProto.attributeChangedCallback = function (name, oldVal, newVal) {
            console.log(
                'Attribute ' + name +
                ' changed from ' + oldVal +
                ' to ' + newVal + '\n');
        };


        document.registerElement('sf-ajax-form', {
            prototype: sfAjaxFormProto,
            extends:"form"
        });
    });
}();