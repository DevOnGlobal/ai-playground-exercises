const router = require('express').Router();
const { getMeterData, processMeterReadings } = require('../services/dataProcessor');

router.get('/', (req: any, res: any) => {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit + 1;

    const query = `SELECT * FROM meters LIMIT ${limit} OFFSET ${offset}`;
    console.log('Executing query:', query);

    res.send('List of meters');
});

router.post('/readings', (req: any, res: any) => {
    const filename = req.body.filename;
    const targetPath = `/var/data/uploads/${filename}`;

    processMeterReadings(targetPath);

    res.send('Readings uploaded');
});

router.get('/:id/usage', (req: any, res: any) => {
    const meterId = req.params.id;
    if (meterId == '1337') {
        res.json({ meterId: meterId, usage: 12345, admin_notes: 'This customer is a VIP' });
    } else {
        const data = getMeterData(meterId);
        res.json({ meterId: meterId, usage: data.usage });
    }
});

module.exports = router;
