/* Copyright 2015 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
var TF;
(function (TF) {
    var Backend;
    (function (Backend) {
        Backend.BAD_CHARACTERS = '#%&{}\\/<>*? $!\'":@+`|=() ';
        /** Cleanup a url so that it can be loaded from a filesystem. */
        function demoify(s) {
            // for consistency with python's urllib.urlencode
            s = s.replace(new RegExp('%20', 'g'), '+');
            for (var i = 0; i < Backend.BAD_CHARACTERS.length; i++) {
                var c = Backend.BAD_CHARACTERS[i];
                s = s.replace(new RegExp('\\' + c, 'g'), '_');
            }
            return s;
        }
        Backend.demoify = demoify;
        function queryEncoder(params) {
            // It's important that the keys be sorted, so we always grab the right file
            // if we are talking to the backend generated by serialze_tensorboard.py
            if (params == null) {
                return '';
            }
            var components = _.keys(params)
                .sort()
                .filter(function (k) { return params[k] !== undefined; })
                .map(function (k) { return k + '=' + encodeURIComponent(params[k]); });
            var result = components.length ? '?' + components.join('&') : '';
            // Replace parens for consistency with urllib.urlencode
            return result.replace(/\(/g, '%28').replace(/\)/g, '%29');
        }
        Backend.queryEncoder = queryEncoder;
    })(Backend = TF.Backend || (TF.Backend = {}));
})(TF || (TF = {}));
