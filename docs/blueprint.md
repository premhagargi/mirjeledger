# **App Name**: Brewventory Pro

## Core Features:

- Secure Admin Access: Implement single-user email/password authentication with protected routes and logout functionality for administrator-only access.
- Stock Master Management: Enable full CRUD operations (Create, Read, Update, Delete) for tea and coffee stock items, including unique names and types, stored in Firestore.
- Supplier Agent Management: Manage purchase agents/suppliers with CRUD capabilities, including names and optional phone numbers, and display them in searchable dropdowns.
- Purchase Entry (Stock In): Record incoming stock via a form with date, agent, stock, quantity (kg/bags), and rate. Includes real-time calculation of total amount, validations (e.g., kg > 0), and storage to Firestore.
- Sales Entry (Stock Out): Process outgoing stock transactions with customer details (type, name), stock, quantity (kg/bags), and sale rate. Auto-calculates total amount, includes validations, and stores to Firestore.
- Dashboard Overview: Provide an intuitive dashboard displaying key business metrics such as total stock count, total purchase amount, and total sales amount using summary cards, fetching data from Firestore.
- Smart Sales Trend Tool: An AI-powered tool that analyzes historical sales data to identify popular products, sales peaks, and slow-moving items, providing insights to optimize stock levels and purchasing decisions.

## Style Guidelines:

- Primary color: #A34F29 (Burnt Orange/Terracotta) for a warm, grounded, and professional feel, contrasting well with a light background.
- Background color: #F9F5F4 (Warm Off-white), a heavily desaturated version of the primary hue, providing a clean and readable canvas.
- Accent color: #D67289 (Soft Rose), an analogous hue that adds a touch of subtle warmth and serves for highlighting key interactive elements.
- Body and headline font: 'Inter' (sans-serif) for its excellent legibility across all screen sizes and its modern, neutral, and efficient appearance, ideal for data-heavy applications.
- Utilize clear, crisp, and context-appropriate icons (e.g., add, edit, delete, search) for forms and tables to enhance usability without cluttering the interface.
- Implement a mobile-first responsive layout to ensure accessibility on various devices, featuring well-structured forms with inline validation, searchable tables, and informative summary cards.
- Incorporate subtle animations for feedback, such as toast notifications on success/failure, and disabling submit buttons while data is being processed, to improve user experience.