import React, { useState } from 'react';

// Replace with your deployed Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNZpIl19fpfAFx3yDLJ6QZdYyzKwyP-pjx3TJuiG_N2aUQSQLuqEOazz3LGOgdPRPBzA/exec';

const WaitlistModal = ({ onClose, onSubmit } : { onClose: () => void, onSubmit:  (email: any) => void}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = (email : string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email }).toString(),
      });

      // Check if response was successful
      if (response) {
        setMessage('Thank you for joining the waitlist!');
        setEmail('');
      } else {
        setMessage('There was an issue with your submission.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setMessage('There was an error. Please try again later.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-80 text-white relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white font-bold">X</button>
        <h2 className="text-xl mb-4">Join Waitlist</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 text-black"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 w-full py-2 rounded-lg"
        >
          Submit
        </button>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default WaitlistModal;