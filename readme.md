## ReadMe: NodeJS Forward Proxy

This application implements a forward proxy server in NodeJS, handling both HTTP and HTTPS connections.

**Installation:**

1. Clone this repository:

```
git clone https://<your_github_username>/<repository_name>.git
```

2. Navigate to the project directory:

```
cd <repository_name>
```

3. Run the application (assuming NodeJS version 14 or higher):

```
node app.js
```

**How to Use:**

1. Configure your application (e.g., browser) to use the following proxy servers:
    * HTTP traffic: `localhost:3456`
    * HTTPS traffic (if implemented): `localhost:3457` (**requires a valid key and certificate**)

2. **HTTP Requests:** When you access a website through the HTTP proxy (port 3456), if the response contains the substring "HTML" (case-insensitive), the proxy will automatically append the string "**NODEJS**" to the response before sending it back.

3. **HTTPS Requests (Bonus):** If you implemented the bonus feature, HTTPS connections on port 3457 will also have their responses modified with "**NODEJS**" for content containing "HTML" (case-insensitive).

**Assumptions and Constraints:**

* This code assumes a basic understanding of NodeJS and HTTP/HTTPS protocols.
* No external libraries are used for simplicity. 
* A valid key and certificate (`localhost.key` and `localhost.crt`) are required for HTTPS functionality (bonus feature).

**Basis for Selecting Implementation:**

* The application utilizes the built-in `http` and `https` modules for handling HTTP and HTTPS connections directly.
* This approach avoids external library dependencies and demonstrates core NodeJS functionalities.

**Troubleshooting "Proxy CONNECT aborted" Error:**

This error message can occur for various reasons. Here are some troubleshooting steps:

  * **Hostname Resolution:**
    * Ensure the proxy server can resolve the target server's hostname correctly.
    * Verify your system's DNS settings are configured properly.
  * **Proxy Configuration:**
    * Double-check the proxy address (`localhost:3456`) in your `curl` command or application settings.
    * Make sure the proxy server is running on the specified port (3456 by default).

**Note:**

* This is a basic implementation for educational purposes. Production use may require additional security measures, logging, and error handling.

**Further Enhancements:**

* Consider implementing user authentication for the proxy server.
* Explore error handling for various scenarios (e.g., target server unreachable).