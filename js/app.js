"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,a){return t&&_defineProperties(e.prototype,t),a&&_defineProperties(e,a),e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _createSuper(e){var t=_isNativeReflectConstruct();return function(){var a,n=_getPrototypeOf(e);if(t){var r=_getPrototypeOf(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return _possibleConstructorReturn(this,a)}}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function runMainApp(){ReactDOM.render(React.createElement(MainApp,null),document.getElementById("main"))}var MainApp=function(e){_inherits(a,React.Component);var t=_createSuper(a);function a(e){var n;return _classCallCheck(this,a),(n=t.call(this,e)).state={},n}return _createClass(a,[{key:"render",value:function(){return React.createElement("div",{className:"mainApp"},React.createElement(NavBar,null),React.createElement(MainBody,null))}}]),a}(),MainBody=function(e){_inherits(a,React.Component);var t=_createSuper(a);function a(e){return _classCallCheck(this,a),t.call(this,e)}return _createClass(a,[{key:"render",value:function(){return React.createElement("div",{className:"container"},"REDESIGN IN PROGRESS")}}]),a}(),NavBar=function(e){_inherits(a,React.Component);var t=_createSuper(a);function a(e){var n;return _classCallCheck(this,a),_defineProperty(_assertThisInitialized(n=t.call(this,e)),"burgerMenuClicked",(function(){n.setState({showMenu:!n.state.showMenu},(function(){n.fireListeners(n.state.showMenu)}))})),_defineProperty(_assertThisInitialized(n),"fireListeners",(function(e){for(var t in n.listeners)null==t||t(e)})),_defineProperty(_assertThisInitialized(n),"addListener",(function(e){return n.listeners.push(e)})),n.state={showMenu:!1},n.listeners=[],n}return _createClass(a,[{key:"render",value:function(){return React.createElement("nav",{className:"navbar jpm-navbar",role:"navigation","aria-label":"main navigation"},React.createElement(NavBarBrand,{burgerMenuClicked:this.burgerMenuClicked}),React.createElement(NavBarMenu,{showMenu:this.state.showMenu,addListener:this.addListener}))}}]),a}(),NavBarBrand=function(e){_inherits(a,React.Component);var t=_createSuper(a);function a(e){var n;return _classCallCheck(this,a),_defineProperty(_assertThisInitialized(n=t.call(this,e)),"handleClickMenu",(function(e){var t,a;e.preventDefault(),null===(t=n.props)||void 0===t||null===(a=t.burgerMenuClicked)||void 0===a||a.call(t)})),n.state={},n}return _createClass(a,[{key:"render",value:function(){return React.createElement("div",{className:"navbar-brand"},React.createElement("a",{href:"/",className:"navbar-item"},React.createElement("img",{src:"https://bulma.io/images/bulma-logo.png",width:"112",height:"28"})),React.createElement("a",{role:"button",className:"navbar-burger","aria-label":"menu","aria-expanded":"false","data-target":"navbarMenu",onClick:this.handleClickMenu},React.createElement("span",{"aria-hidden":"true"}),React.createElement("span",{"aria-hidden":"true"}),React.createElement("span",{"aria-hidden":"true"})))}}]),a}(),NavBarMenu=function(e){_inherits(a,React.Component);var t=_createSuper(a);function a(e){var n,r;return _classCallCheck(this,a),_defineProperty(_assertThisInitialized(r=t.call(this,e)),"showMenuChanged",(function(e){r.setState({isActive:r.getActiveMenuClass(e)})})),null==e||null===(n=e.addListener)||void 0===n||n.call(e,r.showMenuChanged.bind(_assertThisInitialized(r))),r.state={isActive:r.getActiveMenuClass(e.showMenu)},r}return _createClass(a,[{key:"getActiveMenuClass",value:function(e){return e?"is-active":""}},{key:"render",value:function(){return React.createElement("div",{id:"navbarMenu",className:"navbar-menu ".concat(this.state.isActive)},React.createElement("div",{className:"navbar-start"},React.createElement("a",{className:"navbar-item"},"Home"),React.createElement("a",{className:"navbar-item"},"Documentation"),React.createElement("div",{className:"navbar-item has-dropdown is-hoverable"},React.createElement("a",{className:"navbar-link"},"More"),React.createElement("div",{className:"navbar-dropdown"},React.createElement("a",{className:"navbar-item"},"About"),React.createElement("a",{className:"navbar-item"},"Jobs"),React.createElement("a",{className:"navbar-item"},"Contact"),React.createElement("hr",{className:"navbar-divider"}),React.createElement("a",{className:"navbar-item"},"Report an issue")))),React.createElement("div",{className:"navbar-end"},React.createElement("div",{className:"navbar-item"},React.createElement("div",{className:"buttons"},React.createElement("a",{className:"button is-primary"},React.createElement("strong",null,"Sign up")),React.createElement("a",{className:"button is-light"},"Log in")))))}}]),a}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzeCIsIm1haW5BcHAuanN4IiwibWFpbkJvZHkuanN4IiwibmF2QmFyLmpzeCIsIm5hdkJhckJyYW5kLmpzeCIsIm5hdkJhck1lbnUuanN4Il0sIm5hbWVzIjpbInJ1bk1haW5BcHAiLCJSZWFjdERPTSIsInJlbmRlciIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIk1haW5BcHAiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiQ29tcG9uZW50IiwicHJvcHMiLCJfdGhpcyIsIl9jbGFzc0NhbGxDaGVjayIsInRoaXMiLCJfc3VwZXIiLCJjYWxsIiwic3RhdGUiLCJjbGFzc05hbWUiLCJOYXZCYXIiLCJNYWluQm9keSIsIl9zdXBlcjIiLCJfdGhpczIiLCJfZGVmaW5lUHJvcGVydHkiLCJfYXNzZXJ0VGhpc0luaXRpYWxpemVkIiwiX3N1cGVyMyIsInNldFN0YXRlIiwic2hvd01lbnUiLCJmaXJlTGlzdGVuZXJzIiwidmFsdWUiLCJsaXN0ZW5lciIsImxpc3RlbmVycyIsImYiLCJwdXNoIiwicm9sZSIsImFyaWEtbGFiZWwiLCJOYXZCYXJCcmFuZCIsImJ1cmdlck1lbnVDbGlja2VkIiwiTmF2QmFyTWVudSIsImFkZExpc3RlbmVyIiwiX3RoaXMzIiwiX3N1cGVyNCIsImUiLCJfdGhpczMkcHJvcHMiLCJfdGhpczMkcHJvcHMkYnVyZ2VyTWUiLCJwcmV2ZW50RGVmYXVsdCIsImhyZWYiLCJzcmMiLCJ3aWR0aCIsImhlaWdodCIsImFyaWEtZXhwYW5kZWQiLCJkYXRhLXRhcmdldCIsIm9uQ2xpY2siLCJoYW5kbGVDbGlja01lbnUiLCJhcmlhLWhpZGRlbiIsIl9wcm9wcyRhZGRMaXN0ZW5lciIsIl90aGlzNCIsIl9zdXBlcjUiLCJpc0FjdGl2ZSIsImdldEFjdGl2ZU1lbnVDbGFzcyIsInNob3dNZW51Q2hhbmdlZCIsImJpbmQiLCJpZCIsImNvbmNhdCJdLCJtYXBwaW5ncyI6IjhqRUFBQSxTQUFBQSxhQUNBQyxTQUFBQyxPQUNBQyxNQUFB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QSxtQkFBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBydW5NYWluQXBwKCkge1xuICAgIGNvbnN0IG1haW5BcHAgPSBSZWFjdERPTS5yZW5kZXIoXG4gICAgICAgIDxNYWluQXBwLz4sXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJylcbiAgICApO1xufSIsImNsYXNzIE1haW5BcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFpbkFwcFwiPlxuICAgICAgICAgICAgICAgIDxOYXZCYXI+PC9OYXZCYXI+XG4gICAgICAgICAgICAgICAgPE1haW5Cb2R5PjwvTWFpbkJvZHk+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbiAgICBcbn0iLCJjbGFzcyBNYWluQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5SRURFU0lHTiBJTiBQUk9HUkVTUzwvZGl2PlxuICAgICAgICApXG4gICAgfVxufSIsImNsYXNzIE5hdkJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzaG93TWVudTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdXG4gICAgfVxuXG4gICAgYnVyZ2VyTWVudUNsaWNrZWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc2hvd01lbnU6ICF0aGlzLnN0YXRlLnNob3dNZW51XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlyZUxpc3RlbmVycyh0aGlzLnN0YXRlLnNob3dNZW51KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZpcmVMaXN0ZW5lcnMgPSAodmFsdWUpID0+IHtcbiAgICAgICAgZm9yIChsZXQgbGlzdGVuZXIgaW4gdGhpcy5saXN0ZW5lcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpc3RlbmVyPy4odmFsdWUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lciA9IChmKSA9PiB0aGlzLmxpc3RlbmVycy5wdXNoKGYpXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhciBqcG0tbmF2YmFyXCIgcm9sZT1cIm5hdmlnYXRpb25cIiBhcmlhLWxhYmVsPVwibWFpbiBuYXZpZ2F0aW9uXCI+XG4gICAgICAgICAgICAgICAgPE5hdkJhckJyYW5kIGJ1cmdlck1lbnVDbGlja2VkPXt0aGlzLmJ1cmdlck1lbnVDbGlja2VkfT48L05hdkJhckJyYW5kPlxuICAgICAgICAgICAgICAgIDxOYXZCYXJNZW51IHNob3dNZW51PXt0aGlzLnN0YXRlLnNob3dNZW51fSBhZGRMaXN0ZW5lcj17dGhpcy5hZGRMaXN0ZW5lcn0+PC9OYXZCYXJNZW51PlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgIClcbiAgICB9XG59IiwiY2xhc3MgTmF2QmFyQnJhbmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVDbGlja01lbnUgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMucHJvcHM/LmJ1cmdlck1lbnVDbGlja2VkPy4oKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9cIiBjbGFzc05hbWU9XCJuYXZiYXItaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vYnVsbWEuaW8vaW1hZ2VzL2J1bG1hLWxvZ28ucG5nXCIgd2lkdGg9XCIxMTJcIiBoZWlnaHQ9XCIyOFwiLz5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPGEgcm9sZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm5hdmJhci1idXJnZXJcIiBhcmlhLWxhYmVsPVwibWVudVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGRhdGEtdGFyZ2V0PVwibmF2YmFyTWVudVwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2tNZW51fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn0iLCJjbGFzcyBOYXZCYXJNZW51IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcylcbiAgICAgICAgcHJvcHM/LmFkZExpc3RlbmVyPy4odGhpcy5zaG93TWVudUNoYW5nZWQuYmluZCh0aGlzKSlcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0aGlzLmdldEFjdGl2ZU1lbnVDbGFzcyhwcm9wcy5zaG93TWVudSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dNZW51Q2hhbmdlZCA9IChzaG93TWVudSkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0aGlzLmdldEFjdGl2ZU1lbnVDbGFzcyhzaG93TWVudSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRBY3RpdmVNZW51Q2xhc3Moc2hvd01lbnUpIHtcbiAgICAgICAgcmV0dXJuIHNob3dNZW51ID8gJ2lzLWFjdGl2ZScgOiAnJ1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJuYXZiYXJNZW51XCIgY2xhc3NOYW1lPXtgbmF2YmFyLW1lbnUgJHt0aGlzLnN0YXRlLmlzQWN0aXZlfWB9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLXN0YXJ0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBIb21lXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cblxuICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgRG9jdW1lbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaXRlbSBoYXMtZHJvcGRvd24gaXMtaG92ZXJhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItbGlua1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1vcmVcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1kcm9wZG93blwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFib3V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpvYnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udGFjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwibmF2YmFyLWRpdmlkZXJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVwb3J0IGFuIGlzc3VlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZW5kXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ1dHRvbiBpcy1wcmltYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+U2lnbiB1cDwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b24gaXMtbGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTG9nIGluXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59Il19
