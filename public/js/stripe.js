import { showAlert } from './alert.js';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51OybPQD20VeHaUlfNb8UZQL6aTt5AA3AS198xNQehRAQWSYnQBAkKrg3cKZzVT2n4Q6pM9IPJEa3hN6kZrXchFve00a8Xk59BE',
  );

  try {
    //1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    // console.log(session);

    //2) Create checkout from + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};