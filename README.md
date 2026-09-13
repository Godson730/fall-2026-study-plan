# Fall 2026 Study Plan

A small installable web app (PWA) with a week-by-week study plan for CHEM*1050, CHEM*2700, BIOC*2580 and IPS*1500, Fall 2026.

- Open https://godson730.github.io/fall-2026-study-plan/ on your phone.
- iPhone (Safari): Share → Add to Home Screen. Android (Chrome): ⋮ menu → Install app.
- Works offline. Ticks and dates are saved on the device only; use Guide → Move your ticks to copy them between devices.

## Daily reminder

A GitHub Actions job (`.github/workflows/reminders.yml`) wakes each subscribed phone once a day; the app writes the notification from the ticks saved on that phone.

1. In the app: Guide -> Daily reminder -> Turn on daily reminder.
2. Copy the reminder code and save it as the repository secret `PUSH_SUBSCRIPTIONS` (one code per line for several devices).
3. To test, run the "Daily reminder" workflow manually from the Actions tab.

iPhone needs the app added to the Home Screen (iOS 16.4 or later).
