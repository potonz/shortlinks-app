import { createFileRoute, Link } from "@tanstack/solid-router";

export const Route = createFileRoute("/terms-of-service")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div class="prose prose-zinc prose-invert max-w-4xl">
            <h1>Terms of Service</h1>

            <p>
                <strong>Last Updated:</strong>
                {" 6 January 2026"}
                <br />
                <strong>Effective Date:</strong>
                {" 6 January 2026"}
            </p>

            <h2>1. Introduction</h2>
            <p>By accessing or using Poto.nz ("Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. This is an open source project licensed under the MIT License. If you do not agree with these Terms or our Privacy Policy, you may not use the Service.</p>

            <h2>2. Service Description</h2>
            <p>Poto.nz provides a link shortening service that allows users to create shortened URLs for sharing. The Service is provided "AS IS" without warranty of any kind.</p>

            <p>
                <strong>Important Notice:</strong>
                {" When using our Service, you acknowledge that your data may be processed by Cloudflare (including their Web Application Firewall services) for security purposes. All data collected through Cloudflare (including IP addresses) is subject to Cloudflare's own data processing practices as described in their "}
                <a href="https://www.cloudflare.com/privacypolicy/">Privacy Policy.</a>
            </p>

            <h2>3. User Responsibilities</h2>
            <ul>
                <li>You must be at least 18 years old to use the Service</li>
                <li>You must not use the Service for illegal purposes or activities that could harm the Service</li>
                <li>You must not abuse the Service for spamming, phishing, or distributing malware</li>
                <li>You must not violate the terms of this agreement or any applicable law</li>
                <li>You must not collect or use the data of Service users without explicit authorization</li>
            </ul>

            <h2>4. Account Registration</h2>
            <ul>
                <li>To use the Service, you must create an account with a valid email address</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You agree to provide accurate and current information when creating an account</li>
                <li>You may request deletion of your account and associated data via [privacy@yourdomain.com] within 30 days of request</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>
                {"This Service is open source software licensed under the "}
                <a href="/LICENSE">MIT License</a>
                . The MIT License is included below for reference:
            </p>

            <pre>
                <code>
                    {`MIT License

Copyright (c) 2025-2026 Thomas Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                </code>
            </pre>

            <h2>6. Data Collection and Processing</h2>
            <p>We collect the following information to operate and improve our Service:</p>
            <ul>
                <li>Account registration data (email address)</li>
                <li>Short link creation data (user-generated content)</li>
                <li>Usage statistics for analytical purposes (aggregated and anonymized)</li>
                <li>Cloudflare-generated data (IP addresses, user agents, geographic location information)</li>
            </ul>

            <p>Data is stored in Cloudflare's D1 database for security and analytical purposes only. We delete all data after one year from collection date, or immediately when links are reported for illegal activity.</p>

            <h2>7. Limitation of Liability</h2>
            <p>TO THE FULLEST EXTENT PERMITTED BY LAW, Poto.nz AND ITS LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES (INCLUDING, BUT NOT LIMITED TO, LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION) ARISING FROM:</p>
            <ul>
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or alteration of your data</li>
                <li>Any content transmitted or received through the Service</li>
                <li>Any errors or omissions in any content, or any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available via the Service</li>
            </ul>

            <h2>8. Privacy Policy</h2>
            <p>
                {"We respect your privacy and use your data responsibly. Please review our "}
                <Link to="/privacy-policy">Privacy Policy</Link>
                {" for more information on how we collect, use, and protect your data."}
            </p>

            <h2>9. Termination</h2>
            <p>We may terminate or suspend your account and access to the Service at any time without notice for conduct that we believe violates these Terms or is harmful to the Service or other users. You may terminate your use of the Service at any time.</p>

            <h2>10. Governing Law</h2>
            <p>These Terms are governed by the laws of New Zealand, without regard to conflict of laws principles. Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the courts of New Zealand.</p>

            <h2>11. Changes to Terms of Service</h2>
            <p>We reserve the right to modify or update these Terms at any time without prior notice. Changes will be effective upon posting the revised Terms on this page. Your continued use of the Service after such modifications constitutes your acceptance of the revised Terms.</p>
        </div>
    );
}
