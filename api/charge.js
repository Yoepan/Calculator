const midtransClient = require('midtrans-client');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        let snap = new midtransClient.Snap({
            isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        });

        let parameter = {
            transaction_details: {
                order_id: "CALC-" + Math.floor(Math.random() * 1000000),
                gross_amount: 19900
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: "Calculator+",
                last_name: "User",
                email: "user@calculatorplus.test",
                phone: "081234567890"
            },
            item_details: [{
                id: "ITEM1",
                price: 19900,
                quantity: 1,
                name: "Calculator+ Premium Monthly"
            }]
        };

        const transaction = await snap.createTransaction(parameter);
        return res.status(200).json({ token: transaction.token });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Failed to generate token', details: error.message });
    }
};
