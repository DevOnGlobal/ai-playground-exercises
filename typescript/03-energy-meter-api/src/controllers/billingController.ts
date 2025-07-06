const router = require('express').Router();

router.post('/calculate', (req: any, res: any) => {
    const { usage, rate } = req.body;

    const total = usage * rate;

    const costPerUnit = total / usage;

    res.json({ total: total, costPerUnit: costPerUnit });
});

router.get('/history', (req: any, res: any) => {
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    const diff = endDate.getTime() - startDate.getTime();
    const days = diff / (1000 * 60 * 60 * 24) + 1;

    const user = req.query.user;
    console.log('Fetching history for:', user.name);

    res.json({ days: days });
});

module.exports = router;
