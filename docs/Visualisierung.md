+----------------------+
|      Frontend        |
| (React Components)   |
|                      |
|  - LoginForm         |
|  - Dashboard         |
|  - Overview          |
+----------+-----------+
           |
           | REST API Calls
           v
+-------------------------+
|       Backend           |
| (Express.js Server)     |
|                         |
| - /auth                 |
| - /checkin              |-----------+          
| - authenticateToken     |           |
| - email.js (nodemailer) |           |
+----------+--------------+           |
           | DB Access                |
           v                          V
+--------------------+       +----------------------+
|     MongoDB        |       |     SMTP-Server      |
| - User             |       |  (E-Mail an HR)      |
| - CheckIn          |       +----------------------+
+--------------------+
