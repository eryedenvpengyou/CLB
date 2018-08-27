/**
 * 安装这个插件是为了完整使用 ES6 的 API
 * Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API ，
 * 比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象
 * 以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码
 * 
 * 放第一个，为了照顾IE
 */
import 'babel-polyfill';

import dva from 'dva';
import './styles/common.css';


// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/qa'));
app.model(require('./models/channel'));
app.model(require('./models/production'));
app.model(require('./models/order'));
app.model(require('./models/register'));
app.model(require('./models/code'));
app.model(require('./models/customer'));
app.model(require('./models/course'));
app.model(require('./models/functional'));
app.model(require('./models/reservation'));
app.model(require('./models/secureOrder'));

// 4. Router
app.router(require('./router'));

//验证是否已登录
// if (!localStorage.access_token) {
//   location.hash = '/login';
// }

// 5. Start
app.start('#root');
