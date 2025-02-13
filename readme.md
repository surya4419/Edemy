# 📚 Full Stack Learning Management System (LMS)

A comprehensive and modern Learning Management System (LMS) built with the MERN stack (MongoDB, Express.js, React.js, Node.js), featuring user authentication with Clerk and secure payments via Stripe.

## 🚀 Features
- **User Authentication:** Secure sign-up/login using Clerk.
- **Course Management:** Admins can create, update, and delete courses.
- **Student Enrollment:** Users can enroll in courses and track progress.
- **Payment Integration:** Secure payment processing with Stripe.
- **Interactive UI:** Responsive and dynamic design with React and Tailwind CSS.
- **Role-Based Access:** Different functionalities for students and instructors.
- **Progress Tracking:** Track course completion status.

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Clerk
- **Payment Gateway:** Stripe

## 🎯 Installation & Setup
1. **Clone the repository:**   

2. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install
   ```

3. **Set up environment variables:** Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:** Open `http://localhost:3000` in your browser.


## ✨ Future Enhancements
- **Live Classes Integration**
- **AI-Powered Course Recommendations**
- **Discussion Forums for Students**

## 🤝 Contributing
Contributions are welcome! Feel free to fork this repository and submit a pull request.

## 📜 License
This project is licensed under the MIT License.

---

💡 Built with passion for seamless learning! 🚀

