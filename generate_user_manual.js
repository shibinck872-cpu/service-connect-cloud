const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPdf = path.join(__dirname, 'User_Manual.pdf');
const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

doc.pipe(fs.createWriteStream(outputPdf));

// Helper for section titles
function addSectionTitle(title) {
  doc.moveDown();
  doc.fontSize(18).font('Helvetica-Bold').fillColor('#2c3e50').text(title);
  doc.moveDown(0.5);
  doc.fillColor('black');
}

// Helper for subtitles
function addSubtitle(subtitle) {
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#34495e').text(subtitle);
  doc.moveDown(0.3);
  doc.fillColor('black');
}

// Helper for body text
function addBodyText(text) {
  doc.fontSize(11).font('Helvetica').text(text, { align: 'justify', lineGap: 2 });
  doc.moveDown(0.8);
}

// Helper for bullet points
function addBullets(items) {
  doc.fontSize(11).font('Helvetica');
  items.forEach(item => {
    doc.text(`• ${item}`, { indent: 20, lineGap: 2 });
  });
  doc.moveDown(0.8);
}

// Title Page
doc.fontSize(28).font('Helvetica-Bold').fillColor('#2980b9').text('Service Connect App', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(20).fillColor('#7f8c8d').text('Complete User Manual', { align: 'center' });
doc.moveDown(3);
doc.fillColor('black');

addSectionTitle('1. Introduction');
addBodyText('Welcome to the Service Connect App! This platform seamlessly connects skilled workers (such as plumbers, electricians, mechanics, and carpenters) with customers who require their services quickly and safely. This manual will guide you through all the features available for both Customers and Service Providers.');

addSectionTitle('2. Getting Started');
addBodyText('To use the application, you must first create an account. You can register either as a Customer or a Service Provider.');
addBullets([
  'Navigate to the registration page.',
  'Choose your role (Customer or Service Provider).',
  'Provide your basic details including name, email, phone number, and a secure password.',
  'Click Register to create your account and automatically log in.'
]);

addSectionTitle('3. For Customers');

addSubtitle('3.1 Browsing Service Providers');
addBodyText('Once logged in, you can browse available professionals in your area. You can filter providers by category (e.g., Plumbing, Electrical, Cleaning) and view their ratings and reviews.');

addSubtitle('3.2 Booking a Service');
addBullets([
  'Select a provider from the list to view their full profile.',
  'Click on "Book Now".',
  'Fill in the problem description, preferred date, and time.',
  'Submit the booking request. The provider will be notified immediately.'
]);

addSubtitle('3.3 Chat & Communication');
addBodyText('After booking, you can communicate with the provider using the real-time chat feature. This helps clarify issues, share photos, and track arrival times.');

addSubtitle('3.4 Payments & Reviews');
addBodyText('Once the service is completed, you can securely pay through the application using Stripe. After payment, you are encouraged to leave a review and rating to help other customers make informed decisions.');

addSectionTitle('4. For Service Providers');

addSubtitle('4.1 Setting Up Your Profile');
addBodyText('As a provider, your profile is your storefront. You must complete your profile by adding:');
addBullets([
  'Your primary skills and categories.',
  'Your years of experience and hourly rates.',
  'A professional profile photo.',
  'A short bio describing your expertise.'
]);

addSubtitle('4.2 Managing Bookings');
addBodyText('You can view all incoming booking requests from your dashboard. You have the option to accept or decline requests based on your availability. Once accepted, use the chat feature to coordinate with the customer.');

addSubtitle('4.3 Receiving Payments');
addBodyText('Payments made by customers are securely processed and transferred to your registered bank account or wallet. Ensure your payment details are up-to-date.');

addSectionTitle('5. Account & Profile Management');
addBodyText('Both Customers and Service Providers have full control over their accounts.');
addBullets([
  'Update Profile: Change your contact details or profile photo at any time.',
  'Change Password: Securely update your password.',
  'Account Deactivation: You can deactivate or delete your account permanently if no longer needed.'
]);

addSectionTitle('6. Help & Support');
addBodyText('If you face any issues, you can use the AI Chatbot available on the bottom right of your screen. It can help you describe your problem or navigate the platform. For advanced queries, contact our support team.');

// Add Footer with page numbers
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
  doc.switchToPage(i);
  let oldBottomMargin = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.text(`Page ${i + 1} of ${pages.count}`, 
    50, doc.page.height - 50, 
    { align: 'center' }
  );
  doc.page.margins.bottom = oldBottomMargin;
}

doc.end();

console.log('User Manual PDF generated successfully at User_Manual.pdf');
