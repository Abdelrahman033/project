# Firebase Cloud Functions for Soil Pulse

This directory contains the Firebase Cloud Functions for the Soil Pulse application.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `functions` directory with the following variables:
```
# SendGrid API Key for sending emails
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Firebase Admin SDK configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

3. Deploy the functions:
```bash
firebase deploy --only functions
```

## Available Functions

### sendLoginAlert

Triggers when a user logs in from a new device. Sends an email notification to the user with login details.

**Trigger:** Update to `users/{userId}/metadata/login`
**Action:** Sends an email via SendGrid with login details and a link to change password

## Development

1. Install the Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Functions (if not already done):
```bash
firebase init functions
```

4. Run functions locally:
```bash
firebase emulators:start
```

## Dependencies

- firebase-functions: ^4.0.0
- firebase-admin: ^11.0.0
- @sendgrid/mail: ^7.0.0

## Security Notes

1. Never commit the `.env` file to version control
2. Keep your SendGrid API key secure
3. Use environment variables for all sensitive configuration
4. Regularly rotate API keys and credentials 