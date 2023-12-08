# Welcome to the Moodlets App

This app was created for the [Women Who Code Hackathon for Social Good 2023](https://hopin.com/events/wwcode-hackathon-for-social-good/registration).

Moodlets was inspired by the Sims moodlets (+ personal experiences) and uses colourful visual components to track, update, and send timely notifications about different mental and physical needs.

## Download the App

- [iOS App](https://apps.apple.com/us/app/moodlets/id6469671381)
- [Android App](https://play.google.com/store/apps/details?id=com.moodlet)

## Challenge Statement

This project is aimed at addressing the challenge of individuals frequently overlooking their basic health needs due to being “in the zone”, hyperfocused, or from mental health problems.

The Moodlets project introduces a cross-platform app designed to send timely reminders and allow users to track their mood/status. By merging technology with well-being, Moodlets aims to reduce the long-term impacts of malnutrition, social isolation, stress, and burnout, as well as emphasizing the importance of self-care.

This solution not only promotes individual health but also fosters a society where mental and physical well-being are prioritized.

_TLDR: Moodlets promotes individual and societal well-being via mood/status tracking and reminders._

### Demo Video

- [Loom Link](https://www.loom.com/share/f87c05cb23b74d6bb039b7f6664a27c1?sid=69506069-55cf-4c28-97fb-037b829d3375)
- [YouTube Link](https://youtu.be/WUNz0qWp2EM)

### Presentation Slides

- [PowerPoint Link](https://docs.google.com/presentation/d/1UaryUyxZXKCvVs9dfMBk3Wzm3W6uTHSk/edit?usp=sharing&ouid=110232586300065724404&rtpof=true&sd=true)

### Social Cause

- Health and Wellness

### Technical Category

- Mobile Applications

### Team Dawful Awareness

This project was created with ❤️ by [Josie Daw](https://josiedaw.com) for the Women Who Code Hackathon for Social Good 2023.

### Tech Stack

- Expo (React Native)
- React Native UI Kitten (components and theming)
- Firebase (authentication and database)

## How to Install and Run

- `git clone` the project
- Run `npm install` in your terminal
- Set up Firebase configuration and .env files with your own Firebase configuration details (You will need to create your own Firebase database and permit email/password authentication)
- Run any of the following: `npm run ios` (must be on Mac with an iOS device) / `npm run android` (must have Android virtual device/real device ready)
- Or you can run `npm start` to start with the Expo app for the most convenient way to test it

## Depletion Rate Table

This table is used to display the next approximate notification time depending on the status type and the level it is set at. The "Rate at" refers to the notification rate.

For example, a user that sets hunger at 100% will receive a reminder in 6 hours to keep their hunger levels up. But if they set their hunger at 0%, they will receive a reminder in 45 minutes to gently remind them to eat.

| Status Type | Rate at Max | Rate at Mid | Rate at Low |
| ----------- | :---------: | :---------: | :---------: |
| Hunger      |   6 hours   |   3 hours   |   45 mins   |
| Thirst      |   2 hours   |   1 hour    |   20 mins   |
| Hygiene     |  28 hours   |  14 hours   |   5 hours   |
| Energy      |  18 hours   |  10 hours   |   4 hours   |
| Social      |  72 hours   |  42 hours   |  24 hours   |
| Fun         |  48 hours   |  24 hours   |  12 hours   |

Notifications that are scheduled to push at the same time will be adjusted to be scheduled 30 minutes later.
