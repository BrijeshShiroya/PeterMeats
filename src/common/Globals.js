
const devEnv = {
    BASE_URL: 'https://petertimbs.jadecreative.co.nz/wp-json/api/v1/',
    STRIPE_PUBLISHABLE_KEY: "pk_test_8XAtfhCLjgjlHsL3xIwbSiWg00JF1jC66T",
    STRIPE_SK_KEY: "sk_test_SFGfKRj4rXOjMjSmuN0TvbUx00UaS69o7S",
}

const liveEnv = {
    BASE_URL: 'https://petertimbsmeats.co.nz/wp-json/api/v1/',
    STRIPE_PUBLISHABLE_KEY: "pk_live_fqQVqXwm5ck7pAd7sQhW4K0m00CxiGGJ2n",
    STRIPE_SK_KEY: "sk_live_54BgxS6yMLLo3Vn8S8T1WPkt00t6rSU4y6",
}

module.exports = {
    ...devEnv,
    // ...liveEnv,
}
