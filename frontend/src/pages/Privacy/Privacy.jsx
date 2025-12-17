import React from 'react'
import './Privacy.css'

const Privacy = () => {
  return (
    <div className='privacy-page'>
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Last Updated: December 2025</p>
      </div>

      <div className="privacy-content">
        <section>
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This includes your name, email address, phone number, and delivery address.</p>
        </section>

        <section>
            <h3>2. How We Use Your Information</h3>
            <p>We use your information to process transactions, deliver your orders, manage your account, and improve our services. We may also send you promotional emails if you opt-in.</p>
        </section>

        <section>
            <h3>3. Data Security</h3>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section>
            <h3>4. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@tomato.com.</p>
        </section>
      </div>
    </div>
  )
}

export default Privacy
