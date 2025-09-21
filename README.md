🗺️ Tourist Safety App
A React-based application designed to enhance tourist safety by providing real-time alerts, detailed analytics, and location tracking. This app is built for authorities to manage tourist safety effectively and includes features like customizable notifications and a responsive dashboard.

✨ Features
Real-time Location Tracking: Utilizes Supabase for precise, real-time tracking of tourist locations.

Customizable Alert System: Send notifications to tourists with multiple severity levels (Low, Medium, High, Critical).

Detailed Analytics Dashboard: Gain insights into tourist statistics, including location distribution and incident trends.

Intuitive Multi-tab Interface: Easily manage alerts, view active notifications, and access historical data.

Responsive Design: The application adapts seamlessly to various screen sizes.

🛠️ Installation
To get this project up and running on your local machine, follow these steps:

Clone the repository:

Bash

git clone https://github.com/yourusername/tourist-safety-app.git
Navigate to the project directory:

Bash

cd tourist-safety-app
Install dependencies:

Bash

npm install
Set up environment variables:
Create a .env file in the root directory and add your Supabase credentials. Replace the placeholder values with your own:

Plaintext

VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
Start the development server:

Bash

npm run dev
🚀 Usage
Once the application is running, you can access its features and test its functionality.

Dashboard: View the analytics dashboard to see real-time tourist statistics and trends.

Alerts: Use the Alerts screen to send notifications to tourists, customizing them by type, severity, and location.

Testing: To test the alert system, you can send a sample alert and observe the output in your browser's console.

JavaScript

const sampleAlert = {
  title: "Test Alert",
  message: "This is a test message"
};
console.log(sampleAlert);
💻 Screenshots
📄 License
This project is licensed under the MIT License. See the LICENSE file for more details.

Feel free to ask if you need to add or modify any other sections, such as a "Contributing" or "Technologies Used" section!
