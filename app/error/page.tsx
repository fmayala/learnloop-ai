// pages/auth/error.js
import React from 'react';
import Link from 'next/link';

export default function CustomErrorPage() {
  return (
    <div>
      <h1>Access Denied</h1>
      <p>Only UTC.edu accounts are allowed to sign in. Please try again with a UTC.edu account.</p>
      <Link href="/">Go to Home</Link>
    </div>
  );
}
