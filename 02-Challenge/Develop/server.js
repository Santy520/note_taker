const express = require ('express');
const htmlRoutes = require ('./routes/htmlRoutes')
const apiRoutes = require ('./routes/apiRoutes')

const PORT = process.env.PORT || 3007;

const app = express();

app.use(express.static('public'));

app.use('/api', apiRoutes)

app.use('/', htmlRoutes)

app.listen(PORT, () => (
console.log('server is running on PORT:', PORT)
));