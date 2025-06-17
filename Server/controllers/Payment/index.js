import Stripe from 'stripe';

import Lecture from '../../models/Lecture.js';
import User from '../../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createLectureCheckoutSession = async (req, res) => {
    try {
        const userId = req.currentUser.id;

        if (req.query.session_id) {
            const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

            const lectureId = session.metadata?.lectureId;
            const stripeUserId = session.metadata?.userId;

            if (stripeUserId !== userId) {
                return res.status(403).json({ success: false, message: "Not authorized" });
            }

            await User.findByIdAndUpdate(userId, {
                $addToSet: { purchasedLectures: lectureId }
            });

            return res.status(200).json({
                success: true,
                message: "Lecture added to your purchases.",
                lectureId
            });
        }

        const { lectureId } = req.body;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: { name: lecture.name },
                    unit_amount: Math.round(lecture.price * 100),
                },
                quantity: 1,
            }],
            success_url: `${process.env.CLIENT_URL}/check-out/success`,
            cancel_url: `${process.env.CLIENT_URL}/`,
            metadata: {
                userId,
                lectureId,
            }
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error("Stripe error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};
