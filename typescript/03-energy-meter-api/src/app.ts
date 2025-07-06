const express = require('express');
const app = express();

app.use('/api/meters', require('./controllers/meterController'));
app.use('/api/billing', require('./controllers/billingController'));

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
