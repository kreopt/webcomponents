!function () {
    var owner = (document.currentScript || {}).ownerDocument || document;
    $(owner).ready(function(){
        var sfActionButton = Object.create(HTMLButtonElement.prototype, {
            action: {value: "", writable: true}
        });

        sfActionButton.createdCallback = function () {
            this.addEventListener('click', function(e){
                var url = this.getAttribute('action') || "";
                var _this = this;
                _this.setAttribute('disabled', 'disabled');
                $.ajax({
                    url: url,
                    success: function(r){
                        var evt = new CustomEvent("success", {detail:{response:r}});
                        _this.dispatchEvent(evt);
                        _this.removeAttribute('disabled');
                    },
                    error: function(e){
                        var evt = new CustomEvent("error", {detail:{error:e}});
                        _this.dispatchEvent(evt);
                        _this.removeAttribute('disabled');
                    }
                })
            }, false);
        };

        document.registerElement('sf-action-button', {
            prototype: sfActionButton,
            extends:'button'
        });

        var sfActionCb = Object.create(HTMLInputElement.prototype);

        sfActionCb.createdCallback = function () {
            this.addEventListener('change', function(e){
                var url = this.getAttribute('action') || "";
                var _this = this;
                _this.setAttribute('disabled', 'disabled');
                $.ajax({
                    url: url,
                    data:{
                        checked:_this.checked?1:''
                    },
                    success: function(r){
                        var evt = new CustomEvent("success", {detail:{response:r}});
                        _this.dispatchEvent(evt);
                        _this.removeAttribute('disabled');
                    },
                    error: function(e){
                        var evt = new CustomEvent("error", {detail:{error:e}});
                        _this.dispatchEvent(evt);
                        _this.removeAttribute('disabled');
                    }
                })
            }, false);
        };

        document.registerElement('sf-action-checkbox', {
            prototype: sfActionCb,
            extends:'input'
        });
    });
}();